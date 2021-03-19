import 'cross-fetch/polyfill'
import "@babel/polyfill"
import prisma from './../src/db'
import { seedDatabase, cleanDatabase, userOne } from './utils/SeedAndCleanDB';
import { getClient } from './utils/getClient'
import { createUserMutation, getUsers, login, getProfile } from './utils/operationStrings'

const client = getClient()


beforeEach(seedDatabase)
afterAll(cleanDatabase)



test('Should create a new user', async () => {
    
    const variables = {
        data : {
            name : "JestTestUser",
            email : "jest",
            password : "password" 
        }
    }
    
    const response = await client.mutate({ 
        mutation : createUserMutation,
        variables
     })
    
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
    const response = await client.query({
        query : getUsers
    })

    expect(response.data.users).toHaveLength(2)
    const firstTestUserRetrieved = response.data.users.some((user) => user.name === 'JestSetUpTestUser')
    expect(firstTestUserRetrieved).toBe(true)

})

test('Should not log in with invalid credentials', async () => {
    
    const variables = {
        email : "jest@setup.com",
        password : "invalidpassword"
    }

    await expect(client.mutate({ 
        mutation : login,
        variables 
    })).rejects.toThrow()

})

test('Should not accept a short password for a new user', async () => {
    
    const variables = {
        data : {
            name : "FailedAttempt",
            email : "testing@test.com",
            password : "short"
        }
    }
    
    await expect(client.mutate({ 
        mutation : createUserMutation,
        variables
    })).rejects.toThrow()

})

test('Should retrieve the user profile', async () => {
    const client = getClient(userOne.jwt)
    
    const { data } = await client.query({ query : getProfile })
    expect(data.me).toHaveProperty('id', userOne.user.id)
    expect(data.me).toHaveProperty('name', userOne.user.name)
    expect(data.me).toHaveProperty('email', userOne.user.email)
})