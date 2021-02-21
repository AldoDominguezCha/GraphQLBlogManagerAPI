import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import getUserId from './../utils/getUserId'
const jwt = require('jsonwebtoken')

const Mutation = {
    async login(parent, args, { prisma }, info) {

        const user = await prisma.user.findUnique({
            where : {
                email : args.email
            }
        })
        if(!user)
            throw new Error('The user with the provided email was not found.')
        const isMatch = await bcrypt.compare(args.password, user.password)
        if(!isMatch)
            throw new Error('The password is incorrect.')
        return {
            user,
            token : jwt.sign({ userId : user.id }, 'secret')
        }

    },

    async createUser(parent, args, { prisma }, info) {
        if(args.data.password.length < 7)
            throw new Error('The password must be at least 7 characters long.')

        if(args.data.name.trim() == "" || args.data.email.trim() == "")
            throw new Error("Bad arguments to create a new user.")
            
        const emailTakenUser = await prisma.user.findUnique({
            where : {
                email : args.data.email
            }
        })

        if(emailTakenUser) throw new Error('The email is already taken')

        const password = await bcrypt.hash(args.data.password, 10)

        const user = await prisma.user.create({
            data : {
                id : uuidv4(),
                ...args.data,
                password
            }
        })
        return {
            user,
            token : jwt.sign({ userId : user.id }, 'secret')
        }
    },

    async deleteUser(parent, args, { prisma, request, pubsub }, info) {

        const userId = getUserId(request)

        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        })

        if(!user) throw new Error('The user was not found.')

        const postsToDelete = await prisma.post.findMany({
            where : {
                authorId : user.id
            },
            include : {
                comments : true
            }
        })

        for (const post of postsToDelete)
            await prisma.comment.deleteMany({
                where : {
                    postId : post.id
                }
            })
        await prisma.comment.deleteMany({
            where : {
                authorId : user.id
            }
        })

        await prisma.post.deleteMany({
            where : {
                authorId : user.id
            }
        })

        const deletedUser = await prisma.user.delete({
            where : {
                id : user.id
            }
        })

        pubsub.publish(`user:${deletedUser.id}`, {
            myUser : {
                mutation : "DELETED",
                data : deletedUser
            }
        })

        return deletedUser
    },

    async updateUser(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const updateValues = {
            ...args.data
        }

        if(args.data.password) {
            if(args.data.password.length < 7)
                throw new Error('The password must be at least 7 characters long.')
            updateValues.password = await bcrypt.hash(args.data.password, 10)
        }


        return prisma.user.update({
            where : {
                id : userId
            },
            data : updateValues
        })
    },

    async createPost(parent, args, { prisma, pubsub, request }, info) {

        const userId = getUserId(request)

        const author = await prisma.user.findUnique({
            where : {
                id : userId
            }
        })
        if(!author) throw new Error("The provided ID doesn't match with any user.")

        const post = await prisma.post.create({
            data : {
                id : uuidv4(),
                authorId : userId,
                ...args.data
            }
        }) 

        if(post.published)
            pubsub.publish('post', {
                post : {
                    mutation: 'CREATED',
                    data: post
                }   
            })

        return post

    },

    async deletePost(parent, args, { prisma, pubsub, request }, info) {

        const userId = getUserId(request)

        const post = await prisma.post.findFirst({
            where : {
                AND : [
                    {
                        id : args.id
                    },
                    {
                        authorId : userId
                    }
                ]
            }
        })

        if(!post) throw new Error('The post you are trying to delete was not found or does not belong to you.')

        await prisma.comment.deleteMany({
            where : {
                postId : post.id
            }
        })

        const deletedPost = await prisma.post.delete({
            where : {
                id : post.id
            }
        })

        return deletedPost

    },

    async updatePost(parent, args, { prisma, pubsub, request }, info) {

        const userId = getUserId(request)

        const originalPost = await prisma.post.findFirst({
            where : {
                AND : [
                    {
                        id : args.id
                    },
                    {
                        authorId : userId
                    }
                ]
            }
        })
        if(!originalPost) throw new Error('The post was not found or it does not belong to you.')

        const post = await prisma.post.update({
            where : { id : originalPost.id },
            data : args.data
        })

        

        if(typeof args.data.published === 'boolean') {
            if(originalPost.published && !post.published) {
                await prisma.comment.deleteMany({
                    where : {
                        postId : originalPost.id
                    }
                })
                pubsub.publish('post', {
                    post : {
                        mutation : "DELETED",
                        data : originalPost
                    }
                })
            }
            else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post : {
                        mutation : "CREATED",
                        data : post
                    }
                })
            }

        }
        else if (post.published) {
            pubsub.publish('post', {
                post : {
                    mutation : "UPDATED",
                    data : post
                }
            })
        }
            
        
        return post
    },

    async createComment(parent, args, { prisma, pubsub, request }, info) {

        const userId = getUserId(request)

        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        })

        const post = await prisma.post.findFirst({
            where : {
                AND : [
                    {
                        id : args.data.postId
                    },
                    {
                        published : true
                    }
                ]
            }
        })

        if(!(user && post)) throw new Error("Invalid user and/or post")

        const comment = await prisma.comment.create({
            data : {
                id : uuidv4(),
                ...args.data,
                authorId : user.id
            }
        }) 
        
        pubsub.publish(`comment:${args.data.postId}`, {
            comment : {
                mutation : "CREATED",
                data : comment
            }
        })
        return comment
    },

    async deleteComment(parent, args, { prisma, pubsub, request }, info) {

        const userId = getUserId(request)

        const comment = await prisma.comment.findFirst({
            where : {
                AND : [
                    {
                        id : args.id
                    },
                    {
                        authorId : userId
                    }
                ]
            }
        })

        if(!comment) throw new Error('The comment you are trying to delete was not found or it does not belong to you.')

        const deletedComment = await prisma.comment.delete({
            where : {
                id : comment.id
            }
        })

        

        pubsub.publish(`comment:${deletedComment.postId}`, {
            comment : {
                mutation : "DELETED",
                data : deletedComment
            }
        })

        return deletedComment
    },

    async updateComment(parent, args, { prisma, pubsub, request }, info) {
        const { id, data } = args

        const userId = getUserId(request)

        const comment = await prisma.comment.findFirst({
            where : {
                AND : [
                    {
                        id
                    },
                    {
                        authorId : userId
                    }
                ]
            }
        })
        if(!comment) throw new Error('The comment was not found or it does not belong to you.')

        if(typeof data.text !== 'string')
            throw new Error('You need to provide a valid string for the update.')
        
        const updatedComment = await prisma.comment.update({
            where : {
                id
            },
            data : data
        })
        pubsub.publish(`comment:${comment.postId}`, {
            comment : {
                mutation : "UPDATED",
                data : updatedComment
            }
        })
        
            
        return updatedComment
    }
}

export { Mutation as default }