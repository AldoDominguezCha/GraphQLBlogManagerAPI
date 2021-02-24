import '@babel/polyfill'
import { GraphQLServer, PubSub } from 'graphql-yoga'
import prisma from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Post,
        User,
        Comment 
    },
    context(request) {
        return {
            prisma,
            pubsub,
            request
        }
    }
})

server.start( { port : process.env.PORT }, () => {
    console.log('GraphQL Yoga server is up!')
})