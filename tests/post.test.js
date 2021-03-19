import 'cross-fetch/polyfill'
import "@babel/polyfill"
import { gql } from '@apollo/client';
import prisma from './../src/db'
import { seedDatabase, cleanDatabase, userOne, postOne, postTwo } from './utils/SeedAndCleanDB';
import { getClient } from './utils/getClient'
import { getPosts, myPostsQuery, updatePost, createPostMutation, deletePostMutation } from './utils/operationStrings'

const client = getClient()


beforeEach(seedDatabase)
afterAll(cleanDatabase)

test('Should retrieve published posts only', async () => {
    
    const response = await client.query({
        query : getPosts
    })

    expect(response.data.posts).toHaveLength(1)
    expect(response.data.posts[0]).toHaveProperty('published', true)
    expect(response.data.posts[0]).toHaveProperty('title', 'Jest published test post')
})

test('Should retrieve all post for the authenticaed user', async () => {
    
    const client = getClient(userOne.jwt)
    
    const { data } = await client.query({ query : myPostsQuery })
    expect(data.myPosts).toHaveLength(2)
    const sameAuthor = data.myPosts.every((post) => post.author.name === userOne.user.name)
    expect(sameAuthor).toBe(true)
    expect(data.myPosts.filter((post) => post.published)).toHaveLength(1)
    expect(data.myPosts.filter((post) => !post.published)).toHaveLength(1)
})

test('Should be able to update own post', async () => {
    const client = getClient(userOne.jwt)
    
    const variables = {
        id : postOne.post.id,
        data : {
            published : false,
            title: "updatedPostTest",
            body: "Updated as part of a test in Jest."
        }
    }

    const { data } = await client.mutate({ mutation : updatePost, variables })
    expect(data.updatePost).toHaveProperty('id', postOne.post.id)
    expect(data.updatePost).toHaveProperty('published', false)
    expect(data.updatePost).toHaveProperty('title', 'updatedPostTest')
    expect(data.updatePost).toHaveProperty('body', 'Updated as part of a test in Jest.')

    const postDirectlyFromDB = await prisma.post.findUnique({
        where : {
            id : postOne.post.id
        }
    })
    
    expect(postDirectlyFromDB).toBeDefined()
    expect(postDirectlyFromDB).toHaveProperty('published', false)
    expect(postDirectlyFromDB).toHaveProperty('title', 'updatedPostTest')
    expect(postDirectlyFromDB).toHaveProperty('body', 'Updated as part of a test in Jest.')
})

test('Should create post for an authenticated user', async () => {
    const client = getClient(userOne.jwt)
    
    const variables = {
        data : {
            title : "TestingCreatePostMutation",
            body : "Created as a part of a test in Jest for the automated testing suite.",
            published : true
        }
    }

    const { data } = await client.mutate({ mutation : createPostMutation, variables })
    expect(data.createPost.author).toHaveProperty('id', userOne.user.id)
    expect(data.createPost.author).toHaveProperty('name', userOne.user.name)
    
    const postDirectlyFromDB = await prisma.post.findUnique({
        where : {
            id : data.createPost.id
        },
        include : {
            author : true
        }
    })

    expect(postDirectlyFromDB).toBeDefined()
    expect(postDirectlyFromDB).toHaveProperty('title', 'TestingCreatePostMutation')
    expect(postDirectlyFromDB).toHaveProperty('body', 'Created as a part of a test in Jest for the automated testing suite.')
    expect(postDirectlyFromDB).toHaveProperty('published', true)
    expect(postDirectlyFromDB.author).toHaveProperty('id', userOne.user.id)
    expect(postDirectlyFromDB.author).toHaveProperty('name', userOne.user.name)
})

test('Should delete the post belonging to an authenticated user', async () => {
    const client = getClient(userOne.jwt)
    
    const variables = {
        id : postTwo.post.id
    }

    const { data } = await client.mutate({ mutation : deletePostMutation, variables })
    expect(data.deletePost).toHaveProperty('id', postTwo.post.id)
    expect(data.deletePost).toHaveProperty('title', postTwo.post.title)
    expect(data.deletePost).toHaveProperty('body', postTwo.post.body)
    expect(data.deletePost).toHaveProperty('published', postTwo.post.published)
    
    const postDirectlyFromDB = await prisma.post.findUnique({
        where : {
            id : postTwo.post.id
        }
    })

    expect(postDirectlyFromDB).toBeNull()
})