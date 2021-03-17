import '@babel/polyfill/noConflict'
import server from './server'

server.start( { port : process.env.PORT }, () => {
    console.log('GraphQL Yoga server is up!')
})