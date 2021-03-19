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

const seedDatabase = async () => {
    await prisma.$executeRaw('DELETE FROM testing."Comment";')
    await prisma.$executeRaw('DELETE FROM testing."Post";')
    await prisma.$executeRaw('DELETE FROM testing."User";')
    
    userOne.user = await prisma.user.create({
        data : userOne.input
    })

    userOne.jwt = jwt.sign({ userId : userOne.user.id }, process.env.SECRET)

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

}

const cleanDatabase = async () => {
    await prisma.$executeRaw('DELETE FROM testing."Comment";')
    await prisma.$executeRaw('DELETE FROM testing."Post";')
    await prisma.$executeRaw('DELETE FROM testing."User";')
}

export { seedDatabase, cleanDatabase, userOne, postOne, postTwo }