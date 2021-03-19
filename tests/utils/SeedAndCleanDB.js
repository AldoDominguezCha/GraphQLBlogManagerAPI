import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from './../../src/db'

const userOne = {
    input : {
        id : uuidv4(),
        name : "JestSetUpTestUser",
        email : "jest@setup.com",
        password : bcrypt.hashSync("password")
    },
    user : undefined,
    jwt : undefined
}

const userTwo = {
    input : {
        id : uuidv4(),
        name : "SecondJestSetUpTestUser",
        email : "secondjest@setup.com",
        password : bcrypt.hashSync("password")
    },
    user : undefined,
    jwt : undefined
}

const postOne = {
    input : {
        id : uuidv4(),
        title : "Jest published test post",
        body : "Automated testing with Jest - Published",
        published : true
    },
    post : undefined
}

const postTwo = {
    input : {
        id : uuidv4(),
        title : "Jest unpublished test post",
        body : "Automated testing with Jest - Unpublished",
        published : false

    },
    post : undefined
}

const commentOne = {
    input : {
        id : uuidv4(),
        text : "Comment by User One"
    },
    comment : undefined
}

const commentTwo = {
    input : {
        id : uuidv4(),
        text : "Comment by User Two"
    },
    comment : undefined
}

const seedDatabase = async () => {
    await prisma.$executeRaw('DELETE FROM testing."Comment";')
    await prisma.$executeRaw('DELETE FROM testing."Post";')
    await prisma.$executeRaw('DELETE FROM testing."User";')
    
    userOne.user = await prisma.user.create({
        data : userOne.input
    })

    userTwo.user = await prisma.user.create({
        data : userTwo.input
    })

    userOne.jwt = jwt.sign({ userId : userOne.user.id }, process.env.SECRET)

    userTwo.jwt = jwt.sign({ userId : userTwo.user.id }, process.env.SECRET)

    const userOneFromDB = await prisma.user.findUnique({
        where :  {
            id : userOne.user.id
        }
    })

    expect(userOneFromDB).not.toBeNull()
    expect(userOneFromDB).toHaveProperty('id', userOne.input.id)
    expect(userOneFromDB).toHaveProperty('name', userOne.input.name)

    const userTwoFromDB = await prisma.user.findUnique({
        where :  {
            id : userTwo.user.id
        }
    })

    expect(userTwoFromDB).not.toBeNull()
    expect(userTwoFromDB).toHaveProperty('id', userTwo.input.id)
    expect(userTwoFromDB).toHaveProperty('name', userTwo.input.name)


    postOne.post = await prisma.post.create({
        data : {
            authorId : userOne.user.id,
            ...postOne.input
        }
    })

    postTwo.post = await prisma.post.create({
        data : {
            authorId : userOne.user.id,
            ...postTwo.input
        }
    })

    const publishedTestPost = postOne.post
    const unpublishedTestPost = postTwo.post

    expect(publishedTestPost).toBeDefined()
    expect(publishedTestPost).toHaveProperty('authorId', userOne.user.id)
    expect(publishedTestPost).toHaveProperty('title', 'Jest published test post')

    expect(unpublishedTestPost).toBeDefined()
    expect(unpublishedTestPost).toHaveProperty('authorId', userOne.user.id)
    expect(unpublishedTestPost).toHaveProperty('title', 'Jest unpublished test post')

    commentOne.comment = await prisma.comment.create({
        data : {
            ...commentOne.input,
            authorId : userOne.user.id,
            postId : postOne.post.id
        }
    })

    commentTwo.comment = await prisma.comment.create({
        data : {
            ...commentTwo.input,
            authorId : userTwo.user.id,
            postId : postOne.post.id
        }
    })

    const commentOneFromDB = await prisma.comment.findUnique({
        where : {
            id : commentOne.comment.id
        },
        include : {
            author : true,
            post : true
        }
    })

    expect(commentOneFromDB).not.toBeNull()
    expect(commentOneFromDB).toHaveProperty('id', commentOne.input.id)
    expect(commentOneFromDB).toHaveProperty('text', commentOne.input.text)
    expect(commentOneFromDB.author).toHaveProperty('id', userOne.user.id)
    expect(commentOneFromDB.author).toHaveProperty('name', userOne.user.name)

    const commentTwoFromDB = await prisma.comment.findUnique({
        where : {
            id : commentTwo.comment.id
        },
        include : {
            author : true,
            post : true
        }
    })

    expect(commentTwoFromDB).not.toBeNull()
    expect(commentTwoFromDB).toHaveProperty('id', commentTwo.input.id)
    expect(commentTwoFromDB).toHaveProperty('text', commentTwo.input.text)
    expect(commentTwoFromDB.author).toHaveProperty('id', userTwo.user.id)
    expect(commentTwoFromDB.author).toHaveProperty('name', userTwo.user.name)

}

const cleanDatabase = async () => {
    await prisma.$executeRaw('DELETE FROM testing."Comment";')
    await prisma.$executeRaw('DELETE FROM testing."Post";')
    await prisma.$executeRaw('DELETE FROM testing."User";')
}

export { 
    seedDatabase, 
    cleanDatabase, 
    userOne,
    userTwo, 
    postOne, 
    postTwo,
    commentOne,
    commentTwo
}