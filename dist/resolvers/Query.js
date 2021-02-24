'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _getUserId = require('./../utils/getUserId');

var _getUserId2 = _interopRequireDefault(_getUserId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Query = {
    users: function users(parent, args, _ref, info) {
        var prisma = _ref.prisma;


        var opArgs = {};

        if (args.orderByCreatedAt === "ASC") opArgs.orderBy = {
            createdAt: 'asc'
        };else if (args.orderByCreatedAt === "DESC") opArgs.orderBy = {
            createdAt: 'desc'
        };

        if (args.skip) opArgs.skip = args.skip;
        if (args.first) opArgs.take = args.first;
        if (args.after) opArgs.cursor = {
            id: args.after
        };

        if (args.query) opArgs.where = {
            name: {
                contains: args.query
            }
        };
        return prisma.user.findMany(opArgs);
    },
    posts: function posts(parent, args, _ref2, info) {
        var prisma = _ref2.prisma;


        var opArgs = {};

        if (args.orderByCreatedAt && args.orderByCreatedAt === "ASC") opArgs.orderBy = {
            createdAt: 'asc'
        };else if (args.orderByCreatedAt && args.orderByCreatedAt === "DESC") opArgs.orderBy = {
            createdAt: 'desc'
        };

        if (args.first) opArgs.take = args.first;
        if (args.skip) opArgs.skip = args.skip;
        if (args.after) opArgs.cursor = {
            id: args.after
        };

        if (args.query) opArgs.where = {
            AND: [{
                published: true
            }, {
                OR: [{
                    title: {
                        contains: args.query
                    }
                }, {
                    body: {
                        contains: args.query
                    }
                }]
            }]
        };else opArgs.where = {
            published: true
        };

        return prisma.post.findMany(opArgs);
    },
    comments: function comments(parent, args, _ref3, info) {
        var prisma = _ref3.prisma;


        var opArgs = {};

        if (args.orderByCreatedAt && args.orderByCreatedAt === "ASC") opArgs.orderBy = {
            createdAt: 'asc'
        };else if (args.orderByCreatedAt && args.orderByCreatedAt === "DESC") opArgs.orderBy = {
            createdAt: 'desc'
        };

        if (args.first) opArgs.take = args.first;
        if (args.skip) opArgs.skip = args.skip;
        if (args.after) opArgs.cursor = {
            id: args.after
        };

        if (args.query) opArgs.where = {
            text: {
                contains: args.query
            }
        };
        return prisma.comment.findMany(opArgs);
    },
    post: function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref4, info) {
            var prisma = _ref4.prisma,
                request = _ref4.request;
            var userId, post;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            userId = (0, _getUserId2.default)(request, false);
                            post = undefined;

                            if (!userId) {
                                _context.next = 8;
                                break;
                            }

                            _context.next = 5;
                            return prisma.post.findFirst({
                                where: {
                                    AND: [{
                                        id: args.id
                                    }, {
                                        OR: [{
                                            published: true
                                        }, {
                                            authorId: userId
                                        }]
                                    }]
                                }
                            });

                        case 5:
                            post = _context.sent;
                            _context.next = 11;
                            break;

                        case 8:
                            _context.next = 10;
                            return prisma.post.findFirst({
                                where: {
                                    AND: [{
                                        id: args.id
                                    }, {
                                        published: true
                                    }]
                                }
                            });

                        case 10:
                            post = _context.sent;

                        case 11:
                            if (post) {
                                _context.next = 13;
                                break;
                            }

                            throw new Error('Post not found.');

                        case 13:
                            return _context.abrupt('return', post);

                        case 14:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function post(_x, _x2, _x3, _x4) {
            return _ref5.apply(this, arguments);
        }

        return post;
    }(),
    me: function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref6) {
            var prisma = _ref6.prisma,
                request = _ref6.request;
            var userId, user;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            userId = (0, _getUserId2.default)(request, true);
                            _context2.next = 3;
                            return prisma.user.findUnique({
                                where: {
                                    id: userId
                                }
                            });

                        case 3:
                            user = _context2.sent;

                            if (user) {
                                _context2.next = 6;
                                break;
                            }

                            throw new Error('The user was not found.');

                        case 6:
                            return _context2.abrupt('return', user);

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function me(_x5, _x6, _x7) {
            return _ref7.apply(this, arguments);
        }

        return me;
    }(),
    myPosts: function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(parent, args, _ref8, info) {
            var prisma = _ref8.prisma,
                request = _ref8.request;
            var userId, opArgs, posts;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            userId = (0, _getUserId2.default)(request);
                            opArgs = {};


                            opArgs.orderBy = {
                                body: 'asc'
                            };

                            if (args.first) opArgs.take = args.first;
                            if (args.skip) opArgs.skip = args.skip;
                            if (args.after) opArgs.cursor = {
                                id: args.after
                            };

                            if (args.query) opArgs.where = {
                                AND: [{
                                    authorId: userId
                                }, {
                                    OR: [{
                                        title: {
                                            contains: args.query
                                        }
                                    }, {
                                        body: {
                                            contains: args.query
                                        }
                                    }]
                                }]
                            };else opArgs.where = {
                                authorId: userId
                            };

                            _context3.next = 9;
                            return prisma.post.findMany(opArgs);

                        case 9:
                            posts = _context3.sent;

                            if (!(posts.length == 0)) {
                                _context3.next = 12;
                                break;
                            }

                            throw new Error('No posts were found related to the provided user.');

                        case 12:
                            return _context3.abrupt('return', posts);

                        case 13:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function myPosts(_x8, _x9, _x10, _x11) {
            return _ref9.apply(this, arguments);
        }

        return myPosts;
    }()
};

exports.default = Query;