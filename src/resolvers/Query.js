import getUserId from './../utils/getUserId'

const Query = {
    users(parent, args, { prisma }, info){

        const opArgs = {}

        opArgs.orderBy = {
            email : 'asc'
        }

        if(args.skip)
            opArgs.skip = args.skip
        if(args.first)
            opArgs.take = args.first
        if(args.after)
            opArgs.cursor = {
                id : args.after
            }


        
        
        if(args.query)
            opArgs.where = {
                name : {
                    contains : args.query
                }
            }
        return prisma.user.findMany(opArgs)
    },
    posts(parent, args, { prisma }, info){
        
        const opArgs = {}

        opArgs.orderBy = {
            body : 'asc'
        }

        if(args.first)
            opArgs.take = args.first
        if(args.skip)
            opArgs.skip = args.skip
        if(args.after)
            opArgs.cursor = {
                id : args.after
            }

        if(args.query)
            opArgs.where = {
                AND : [
                    {   
                        published : true
                    },
                    {
                        OR : [
                            {
                                title : {
                                    contains : args.query
                                }
                            },
                            {
                                body : {
                                    contains : args.query
                                }
                            }
                        ]
                    }
                ]
            }
        else 
            opArgs.where = {
                published : true
            }
        
        return prisma.post.findMany(opArgs)
    },
    comments(parent, args, { prisma }, info){
        
        const opArgs = {}

        opArgs.orderBy = {
            text : 'asc'
        }

        if(args.first)
            opArgs.take = args.first
        if(args.skip)
            opArgs.skip = args.skip
        if(args.after)
            opArgs.cursor = {
                id : args.after
            }

        if(args.query)
            opArgs.where = {
                text : {
                    contains : args.query
                }
            }
        return prisma.comment.findMany(opArgs)
    },

    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)

        let post = undefined

        if(userId)
            post = await prisma.post.findFirst({
                where : {
                    AND : [
                        {
                            id : args.id
                        },
                        {
                            OR : [
                                {
                                    published : true
                                },
                                {
                                    authorId : userId
                                }
                            ]
                        }
                    ]
                }
            })
        else {
            post = await prisma.post.findFirst({
                where : {
                    AND : [
                        {
                            id : args.id
                        },
                        {
                            published : true
                        }
                    ]
                }
            })
        }
            

        if(!post)
            throw new Error('Post not found.')
        return post

    },

    async me(parent, args, { prisma, request }) {

        const userId = getUserId(request, true)

        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        })

        if(!user)
            throw new Error('The user was not found.')
        
        return user

    },

    async myPosts(parent, args, { prisma, request }, info) {
        
        const userId = getUserId(request)

        const opArgs = {}

        opArgs.orderBy = {
            body : 'asc'
        }

        if(args.first)
            opArgs.take = args.first
        if(args.skip)
            opArgs.skip = args.skip
        if(args.after)
            opArgs.cursor = {
                id : args.after
            }

        if(args.query)
            opArgs.where = {
                AND : [
                    {   
                        authorId : userId
                    },
                    {
                        OR : [
                            {
                                title : {
                                    contains : args.query
                                }
                            },
                            {
                                body : {
                                    contains : args.query
                                }
                            }
                        ]
                    }
                ]
            }
        else    
            opArgs.where = {
                authorId : userId
            }

        const posts = await prisma.post.findMany(opArgs)

        if(posts.length == 0)
            throw new Error('No posts were found related to the provided user.')
        return posts

    }
}

export { Query as default }