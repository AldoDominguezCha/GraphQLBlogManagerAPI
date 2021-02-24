'use strict';

require('@babel/polyfill');

var _graphqlYoga = require('graphql-yoga');

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _Query = require('./resolvers/Query');

var _Query2 = _interopRequireDefault(_Query);

var _Mutation = require('./resolvers/Mutation');

var _Mutation2 = _interopRequireDefault(_Mutation);

var _Subscription = require('./resolvers/Subscription');

var _Subscription2 = _interopRequireDefault(_Subscription);

var _Post = require('./resolvers/Post');

var _Post2 = _interopRequireDefault(_Post);

var _User = require('./resolvers/User');

var _User2 = _interopRequireDefault(_User);

var _Comment = require('./resolvers/Comment');

var _Comment2 = _interopRequireDefault(_Comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pubsub = new _graphqlYoga.PubSub();

var server = new _graphqlYoga.GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query: _Query2.default,
        Mutation: _Mutation2.default,
        Subscription: _Subscription2.default,
        Post: _Post2.default,
        User: _User2.default,
        Comment: _Comment2.default
    },
    context: function context(request) {
        return {
            prisma: _db2.default,
            pubsub: pubsub,
            request: request
        };
    }
});

server.start({ port: process.env.PORT }, function () {
    console.log('GraphQL Yoga server is up!');
});