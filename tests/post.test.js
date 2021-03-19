import 'cross-fetch/polyfill'
import "@babel/polyfill"
import { gql } from '@apollo/client';
import prisma from './../src/db'
import { seedDatabase, cleanDatabase } from './utils/SeedAndCleanDB';
import { getClient } from './utils/getClient'

const client = getClient()


beforeEach(seedDatabase)
afterAll(cleanDatabase)

test('Should retrieve published posts only', async () => {
    const getPosts = gql` 
        query {
            posts {
                id
                title
                body
                published
            }
        }
    `
    const response = await client.query({
        query : getPosts
    })

    expect(response.data.posts).toHaveLength(1)
    expect(response.data.posts[0]).toHaveProperty('published', true)
    expect(response.data.posts[0]).toHaveProperty('title', 'Jest published test post')
})