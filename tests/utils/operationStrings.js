import { gql } from '@apollo/client';

const createUserMutation = gql`
        mutation ($data:CreateUserInput!) {
            createUser (
                data : $data
            ) {
                token
                user {
                id
                name
                email
                }
            }
        }
`

const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
`

const login = gql`
        mutation ($email:String!, $password:String!) {
            login (
                email : $email
                password : $password
            ) {
                token
                user {
                    id
                    name
                    email
                }
            }
        }
`

const getProfile = gql`
        query {
            me {
                id
                name
                email
            }
        }
`

export { createUserMutation, getUsers, login, getProfile }