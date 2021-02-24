'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _uuid = require('uuid');

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _getUserId = require('./../utils/getUserId');

var _getUserId2 = _interopRequireDefault(_getUserId);

var _generateToken = require('./../utils/generateToken');

var _generateToken2 = _interopRequireDefault(_generateToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var jwt = require('jsonwebtoken');


var Mutation = {
    login: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
            var prisma = _ref.prisma;
            var user, isMatch;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return prisma.user.findUnique({
                                where: {
                                    email: args.email
                                }
                            });

                        case 2:
                            user = _context.sent;

                            if (user) {
                                _context.next = 5;
                                break;
                            }

                            throw new Error('The user with the provided email was not found.');

                        case 5:
                            _context.next = 7;
                            return _bcryptjs2.default.compare(args.password, user.password);

                        case 7:
                            isMatch = _context.sent;

                            if (isMatch) {
                                _context.next = 10;
                                break;
                            }

                            throw new Error('The password is incorrect.');

                        case 10:
                            return _context.abrupt('return', {
                                user: user,
                                token: (0, _generateToken2.default)(user.id)
                            });

                        case 11:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function login(_x, _x2, _x3, _x4) {
            return _ref2.apply(this, arguments);
        }

        return login;
    }(),
    createUser: function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
            var prisma = _ref3.prisma;
            var emailTakenUser, password, user;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!(args.data.password.length < 7)) {
                                _context2.next = 2;
                                break;
                            }

                            throw new Error('The password must be at least 7 characters long.');

                        case 2:
                            if (!(args.data.name.trim() == "" || args.data.email.trim() == "")) {
                                _context2.next = 4;
                                break;
                            }

                            throw new Error("Bad arguments to create a new user.");

                        case 4:
                            _context2.next = 6;
                            return prisma.user.findUnique({
                                where: {
                                    email: args.data.email
                                }
                            });

                        case 6:
                            emailTakenUser = _context2.sent;

                            if (!emailTakenUser) {
                                _context2.next = 9;
                                break;
                            }

                            throw new Error('The email is already taken');

                        case 9:
                            _context2.next = 11;
                            return _bcryptjs2.default.hash(args.data.password, 10);

                        case 11:
                            password = _context2.sent;
                            _context2.next = 14;
                            return prisma.user.create({
                                data: _extends({
                                    id: (0, _uuid.v4)()
                                }, args.data, {
                                    password: password
                                })
                            });

                        case 14:
                            user = _context2.sent;
                            return _context2.abrupt('return', {
                                user: user,
                                token: (0, _generateToken2.default)(user.id)
                            });

                        case 16:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function createUser(_x5, _x6, _x7, _x8) {
            return _ref4.apply(this, arguments);
        }

        return createUser;
    }(),
    deleteUser: function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(parent, args, _ref5, info) {
            var prisma = _ref5.prisma,
                request = _ref5.request,
                pubsub = _ref5.pubsub;

            var userId, user, postsToDelete, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, post, deletedUser;

            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            userId = (0, _getUserId2.default)(request);
                            _context3.next = 3;
                            return prisma.user.findUnique({
                                where: {
                                    id: userId
                                }
                            });

                        case 3:
                            user = _context3.sent;

                            if (user) {
                                _context3.next = 6;
                                break;
                            }

                            throw new Error('The user was not found.');

                        case 6:
                            _context3.next = 8;
                            return prisma.post.findMany({
                                where: {
                                    authorId: user.id
                                },
                                include: {
                                    comments: true
                                }
                            });

                        case 8:
                            postsToDelete = _context3.sent;
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context3.prev = 12;
                            _iterator = postsToDelete[Symbol.iterator]();

                        case 14:
                            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                _context3.next = 21;
                                break;
                            }

                            post = _step.value;
                            _context3.next = 18;
                            return prisma.comment.deleteMany({
                                where: {
                                    postId: post.id
                                }
                            });

                        case 18:
                            _iteratorNormalCompletion = true;
                            _context3.next = 14;
                            break;

                        case 21:
                            _context3.next = 27;
                            break;

                        case 23:
                            _context3.prev = 23;
                            _context3.t0 = _context3['catch'](12);
                            _didIteratorError = true;
                            _iteratorError = _context3.t0;

                        case 27:
                            _context3.prev = 27;
                            _context3.prev = 28;

                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }

                        case 30:
                            _context3.prev = 30;

                            if (!_didIteratorError) {
                                _context3.next = 33;
                                break;
                            }

                            throw _iteratorError;

                        case 33:
                            return _context3.finish(30);

                        case 34:
                            return _context3.finish(27);

                        case 35:
                            _context3.next = 37;
                            return prisma.comment.deleteMany({
                                where: {
                                    authorId: user.id
                                }
                            });

                        case 37:
                            _context3.next = 39;
                            return prisma.post.deleteMany({
                                where: {
                                    authorId: user.id
                                }
                            });

                        case 39:
                            _context3.next = 41;
                            return prisma.user.delete({
                                where: {
                                    id: user.id
                                }
                            });

                        case 41:
                            deletedUser = _context3.sent;


                            pubsub.publish('user:' + deletedUser.id, {
                                myUser: {
                                    mutation: "DELETED",
                                    data: deletedUser
                                }
                            });

                            return _context3.abrupt('return', deletedUser);

                        case 44:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[12, 23, 27, 35], [28,, 30, 34]]);
        }));

        function deleteUser(_x9, _x10, _x11, _x12) {
            return _ref6.apply(this, arguments);
        }

        return deleteUser;
    }(),
    updateUser: function () {
        var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, args, _ref7, info) {
            var prisma = _ref7.prisma,
                request = _ref7.request;
            var userId, updateValues;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            userId = (0, _getUserId2.default)(request);
                            updateValues = _extends({}, args.data);

                            if (!args.data.password) {
                                _context4.next = 8;
                                break;
                            }

                            if (!(args.data.password.length < 7)) {
                                _context4.next = 5;
                                break;
                            }

                            throw new Error('The password must be at least 7 characters long.');

                        case 5:
                            _context4.next = 7;
                            return _bcryptjs2.default.hash(args.data.password, 10);

                        case 7:
                            updateValues.password = _context4.sent;

                        case 8:
                            return _context4.abrupt('return', prisma.user.update({
                                where: {
                                    id: userId
                                },
                                data: updateValues
                            }));

                        case 9:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function updateUser(_x13, _x14, _x15, _x16) {
            return _ref8.apply(this, arguments);
        }

        return updateUser;
    }(),
    createPost: function () {
        var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(parent, args, _ref9, info) {
            var prisma = _ref9.prisma,
                pubsub = _ref9.pubsub,
                request = _ref9.request;
            var userId, author, post;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            userId = (0, _getUserId2.default)(request);
                            _context5.next = 3;
                            return prisma.user.findUnique({
                                where: {
                                    id: userId
                                }
                            });

                        case 3:
                            author = _context5.sent;

                            if (author) {
                                _context5.next = 6;
                                break;
                            }

                            throw new Error("The provided ID doesn't match with any user.");

                        case 6:
                            _context5.next = 8;
                            return prisma.post.create({
                                data: _extends({
                                    id: (0, _uuid.v4)(),
                                    authorId: userId
                                }, args.data)
                            });

                        case 8:
                            post = _context5.sent;


                            if (post.published) pubsub.publish('post', {
                                post: {
                                    mutation: 'CREATED',
                                    data: post
                                }
                            });

                            return _context5.abrupt('return', post);

                        case 11:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function createPost(_x17, _x18, _x19, _x20) {
            return _ref10.apply(this, arguments);
        }

        return createPost;
    }(),
    deletePost: function () {
        var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(parent, args, _ref11, info) {
            var prisma = _ref11.prisma,
                pubsub = _ref11.pubsub,
                request = _ref11.request;
            var userId, post, deletedPost;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            userId = (0, _getUserId2.default)(request);
                            _context6.next = 3;
                            return prisma.post.findFirst({
                                where: {
                                    AND: [{
                                        id: args.id
                                    }, {
                                        authorId: userId
                                    }]
                                }
                            });

                        case 3:
                            post = _context6.sent;

                            if (post) {
                                _context6.next = 6;
                                break;
                            }

                            throw new Error('The post you are trying to delete was not found or does not belong to you.');

                        case 6:
                            _context6.next = 8;
                            return prisma.comment.deleteMany({
                                where: {
                                    postId: post.id
                                }
                            });

                        case 8:
                            _context6.next = 10;
                            return prisma.post.delete({
                                where: {
                                    id: post.id
                                }
                            });

                        case 10:
                            deletedPost = _context6.sent;
                            return _context6.abrupt('return', deletedPost);

                        case 12:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function deletePost(_x21, _x22, _x23, _x24) {
            return _ref12.apply(this, arguments);
        }

        return deletePost;
    }(),
    updatePost: function () {
        var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(parent, args, _ref13, info) {
            var prisma = _ref13.prisma,
                pubsub = _ref13.pubsub,
                request = _ref13.request;
            var userId, originalPost, post;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            userId = (0, _getUserId2.default)(request);
                            _context7.next = 3;
                            return prisma.post.findFirst({
                                where: {
                                    AND: [{
                                        id: args.id
                                    }, {
                                        authorId: userId
                                    }]
                                }
                            });

                        case 3:
                            originalPost = _context7.sent;

                            if (originalPost) {
                                _context7.next = 6;
                                break;
                            }

                            throw new Error('The post was not found or it does not belong to you.');

                        case 6:
                            _context7.next = 8;
                            return prisma.post.update({
                                where: { id: originalPost.id },
                                data: args.data
                            });

                        case 8:
                            post = _context7.sent;

                            if (!(typeof args.data.published === 'boolean')) {
                                _context7.next = 19;
                                break;
                            }

                            if (!(originalPost.published && !post.published)) {
                                _context7.next = 16;
                                break;
                            }

                            _context7.next = 13;
                            return prisma.comment.deleteMany({
                                where: {
                                    postId: originalPost.id
                                }
                            });

                        case 13:
                            pubsub.publish('post', {
                                post: {
                                    mutation: "DELETED",
                                    data: originalPost
                                }
                            });
                            _context7.next = 17;
                            break;

                        case 16:
                            if (!originalPost.published && post.published) {
                                pubsub.publish('post', {
                                    post: {
                                        mutation: "CREATED",
                                        data: post
                                    }
                                });
                            }

                        case 17:
                            _context7.next = 20;
                            break;

                        case 19:
                            if (post.published) {
                                pubsub.publish('post', {
                                    post: {
                                        mutation: "UPDATED",
                                        data: post
                                    }
                                });
                            }

                        case 20:
                            return _context7.abrupt('return', post);

                        case 21:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));

        function updatePost(_x25, _x26, _x27, _x28) {
            return _ref14.apply(this, arguments);
        }

        return updatePost;
    }(),
    createComment: function () {
        var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(parent, args, _ref15, info) {
            var prisma = _ref15.prisma,
                pubsub = _ref15.pubsub,
                request = _ref15.request;
            var userId, user, post, comment;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            userId = (0, _getUserId2.default)(request);
                            _context8.next = 3;
                            return prisma.user.findUnique({
                                where: {
                                    id: userId
                                }
                            });

                        case 3:
                            user = _context8.sent;
                            _context8.next = 6;
                            return prisma.post.findFirst({
                                where: {
                                    AND: [{
                                        id: args.data.postId
                                    }, {
                                        published: true
                                    }]
                                }
                            });

                        case 6:
                            post = _context8.sent;

                            if (user && post) {
                                _context8.next = 9;
                                break;
                            }

                            throw new Error("Invalid user and/or post");

                        case 9:
                            _context8.next = 11;
                            return prisma.comment.create({
                                data: _extends({
                                    id: (0, _uuid.v4)()
                                }, args.data, {
                                    authorId: user.id
                                })
                            });

                        case 11:
                            comment = _context8.sent;


                            pubsub.publish('comment:' + args.data.postId, {
                                comment: {
                                    mutation: "CREATED",
                                    data: comment
                                }
                            });
                            return _context8.abrupt('return', comment);

                        case 14:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        function createComment(_x29, _x30, _x31, _x32) {
            return _ref16.apply(this, arguments);
        }

        return createComment;
    }(),
    deleteComment: function () {
        var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(parent, args, _ref17, info) {
            var prisma = _ref17.prisma,
                pubsub = _ref17.pubsub,
                request = _ref17.request;
            var userId, comment, deletedComment;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            userId = (0, _getUserId2.default)(request);
                            _context9.next = 3;
                            return prisma.comment.findFirst({
                                where: {
                                    AND: [{
                                        id: args.id
                                    }, {
                                        authorId: userId
                                    }]
                                }
                            });

                        case 3:
                            comment = _context9.sent;

                            if (comment) {
                                _context9.next = 6;
                                break;
                            }

                            throw new Error('The comment you are trying to delete was not found or it does not belong to you.');

                        case 6:
                            _context9.next = 8;
                            return prisma.comment.delete({
                                where: {
                                    id: comment.id
                                }
                            });

                        case 8:
                            deletedComment = _context9.sent;


                            pubsub.publish('comment:' + deletedComment.postId, {
                                comment: {
                                    mutation: "DELETED",
                                    data: deletedComment
                                }
                            });

                            return _context9.abrupt('return', deletedComment);

                        case 11:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, this);
        }));

        function deleteComment(_x33, _x34, _x35, _x36) {
            return _ref18.apply(this, arguments);
        }

        return deleteComment;
    }(),
    updateComment: function () {
        var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(parent, args, _ref19, info) {
            var prisma = _ref19.prisma,
                pubsub = _ref19.pubsub,
                request = _ref19.request;
            var id, data, userId, comment, updatedComment;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            id = args.id, data = args.data;
                            userId = (0, _getUserId2.default)(request);
                            _context10.next = 4;
                            return prisma.comment.findFirst({
                                where: {
                                    AND: [{
                                        id: id
                                    }, {
                                        authorId: userId
                                    }]
                                }
                            });

                        case 4:
                            comment = _context10.sent;

                            if (comment) {
                                _context10.next = 7;
                                break;
                            }

                            throw new Error('The comment was not found or it does not belong to you.');

                        case 7:
                            if (!(typeof data.text !== 'string')) {
                                _context10.next = 9;
                                break;
                            }

                            throw new Error('You need to provide a valid string for the update.');

                        case 9:
                            _context10.next = 11;
                            return prisma.comment.update({
                                where: {
                                    id: id
                                },
                                data: data
                            });

                        case 11:
                            updatedComment = _context10.sent;

                            pubsub.publish('comment:' + comment.postId, {
                                comment: {
                                    mutation: "UPDATED",
                                    data: updatedComment
                                }
                            });

                            return _context10.abrupt('return', updatedComment);

                        case 14:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, _callee10, this);
        }));

        function updateComment(_x37, _x38, _x39, _x40) {
            return _ref20.apply(this, arguments);
        }

        return updateComment;
    }()
};

exports.default = Mutation;