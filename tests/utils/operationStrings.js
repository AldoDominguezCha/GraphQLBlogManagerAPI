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
const myPostsQuery = gql` 
        query {
            myPosts {
                id
                title
                body
                published
                author {
                    id
                    name
                }
            }
        }
`

const updatePost = gql`
    mutation ($id:ID!, $data:updatePostInput!) {
        updatePost (
            id: $id,
            data : $data

        ) {
            id
            title
            body
            published
        }
    }
`

const createPostMutation = gql`
    mutation ($data: CreatePostInput!) {
        createPost(
            data : $data
        ){
            id
            title
            body
            published
            author {
                id
                name
            }
        }
    }
`

const deletePostMutation = gql`
    mutation ($id: ID!) {
        deletePost (
            id : $id
        ) {
            id
            title
            body
            published
        }
    }
`

export { 
    createUserMutation, 
    getUsers, 
    login, 
    getProfile, 
    getPosts, 
    myPostsQuery, 
    updatePost, 
    createPostMutation, 
    deletePostMutation
}