import 'cross-fetch/polyfill'
import "@babel/polyfill"
import prisma from './../src/db'
import { seedDatabase, cleanDatabase, userOne, userTwo, postOne, postTwo, commentOne, commentTwo } from './utils/SeedAndCleanDB';
import { getClient } from './utils/getClient'
import { deleteCommentMutation } from './utils/operationStrings'

const client = getClient()


beforeEach(seedDatabase)
afterAll(cleanDatabase)


test('Should delete the comment belonging to the authenticated user', async () => {
    const client = getClient(userOne.jwt)

    const variables = {
        id : commentOne.comment.id
    }

    const { data } = await client.mutate({ mutation : deleteCommentMutation, variables })

    expect(data.deleteComment).toHaveProperty('id', commentOne.input.id)
    expect(data.deleteComment).toHaveProperty('text', commentOne.input.text)
    expect(data.deleteComment.author).toHaveProperty('id', userOne.input.id)
    expect(data.deleteComment.author).toHaveProperty('name', userOne.input.name)
    expect(data.deleteComment.post).toHaveProperty('id', postOne.input.id)
    expect(data.deleteComment.post).toHaveProperty('title', postOne.input.title)

    const commentOneFromDB = await prisma.comment.findUnique({
        where : {
            id : commentOne.comment.id
        }
    })

    expect(commentOneFromDB).toBeNull()

    const commentsFromUserOneFromDB = await prisma.comment.findMany({
        where : {
            authorId : userOne.user.id
        }
    })

    expect(commentsFromUserOneFromDB).toBeInstanceOf(Array)
    expect(commentsFromUserOneFromDB).toHaveLength(0)

})

test('Should not delete a comment that does not belong to the authenticated user', async () => {
    const client = getClient(userOne.jwt)

    const variables = {
        id : commentTwo.comment.id
    }

    await expect(client.mutate({ mutation : deleteCommentMutation, variables })).rejects.toThrow()

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
    expect(commentTwoFromDB.author).toHaveProperty('id', userTwo.input.id)
    expect(commentTwoFromDB.author).toHaveProperty('name', userTwo.input.name)
    expect(commentTwoFromDB.post).toHaveProperty('id', postOne.input.id)
    expect(commentTwoFromDB.post).toHaveProperty('title', postOne.input.title)
})
