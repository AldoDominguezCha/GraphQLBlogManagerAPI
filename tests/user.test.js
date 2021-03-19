import 'cross-fetch/polyfill'
import "@babel/polyfill"
import { gql } from '@apollo/client';
import prisma from './../src/db'
import { seedDatabase, cleanDatabase, userOne } from './utils/SeedAndCleanDB';
import { getClient } from './utils/getClient'

const client = getClient()


beforeEach(seedDatabase)
afterAll(cleanDatabase)


test('Should create a new user', async () => {
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
    
    const user = await prisma.user.findUnique({
        where : {
            id : response.data.createUser.user.id
        }
    })
    expect(user).toBeDefined()
    expect(user.name).toBe("JestTestUser")
    expect(user.email).toBe("jest")
})

test('Should expose public user profiles', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `
    const response = await client.query({
        query : getUsers
    })

    expect(response.data.users).toHaveLength(1)
    expect(response.data.users[0]).toHaveProperty('name', 'JestSetUpTestUser')
    expect(response.data.users[0].email).toBeNull()

})

test('Should not log in with invalid credentials', async () => {
    const login = gql`
        mutation {
            login (
                email : "jest@setup.com"
                password : "invalidpassword"
            ) {
                token
                user {
                    id
                    name
                }
            }
        }
    `

    await expect(client.mutate({ mutation : login })).rejects.toThrow()

})

test('Should not accept a short password for a new user', async () => {
    const createUserMutation = gql`
        mutation {
            createUser (
                data : {
                name : "FailedAttempt",
                email : "testing@test.com",
                password : "short"
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
    await expect(client.mutate({ mutation : createUserMutation })).rejects.toThrow()

})

test('Should retrieve the user profile', async () => {
    const client = getClient(userOne.jwt)
    const getProfile = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `
    const { data } = await client.query({ query : getProfile })
    expect(data.me).toHaveProperty('id', userOne.user.id)
    expect(data.me).toHaveProperty('name', userOne.user.name)
    expect(data.me).toHaveProperty('email', userOne.user.email)
})