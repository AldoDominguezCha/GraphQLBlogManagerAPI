import 'cross-fetch/polyfill'
import "@babel/polyfill"
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import prisma from './../src/db'

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache()
});


beforeAll(async () => {
    await prisma.$executeRaw('DELETE FROM testing."User";')
    await prisma.$executeRaw('DELETE FROM testing."Post";')
    await prisma.$executeRaw('DELETE FROM testing."Comment";')
})

afterAll(async () => {
    await prisma.$executeRaw('DELETE FROM testing."User";')
    await prisma.$executeRaw('DELETE FROM testing."Post";')
    await prisma.$executeRaw('DELETE FROM testing."Comment";')
})

test('Should create a new user and we can retrieve it', async () => {
    const createUserMutation = gql`
        mutation {
            createUser (
                data : {
                name : "JestTestUser",
                email : "jest",
                password : "password"
                }
            ) {
                token
                user {
                id
                name
                }
            }
        }
    `
    const response = await client.mutate({ mutation : createUserMutation })
    
    const usersQuery = gql`
        query {
            users {
                name
            }
        }
    `
    const user = await prisma.user.findUnique({
        where : {
            id : response.data.createUser.user.id
        }
    })
    expect(user).toBeDefined()
    expect(user.name).toBe("JestTestUser")
    expect(user.email).toBe("jest")
})