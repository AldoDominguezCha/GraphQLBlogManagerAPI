'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _getUserId = require('./../utils/getUserId');

var _getUserId2 = _interopRequireDefault(_getUserId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Subscription = {
    comment: {
        subscribe: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, _ref, _ref2, info) {
                var postId = _ref.postId;
                var pubsub = _ref2.pubsub,
                    prisma = _ref2.prisma;
                var post;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return prisma.post.findUnique({
                                    where: {
                                        id: postId
                                    }
                                });

                            case 2:
                                post = _context.sent;

                                if (post) {
                                    _context.next = 5;
                                    break;
                                }

                                throw new Error('The post was not found.');

                            case 5:
                                return _context.abrupt('return', pubsub.asyncIterator('comment:' + post.id));

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function subscribe(_x, _x2, _x3, _x4) {
                return _ref3.apply(this, arguments);
            }

            return subscribe;
        }()
    },

    post: {
        subscribe: function subscribe(parent, args, _ref4, info) {
            var pubsub = _ref4.pubsub;

            return pubsub.asyncIterator('post');
        }
    },

    myUser: {
        subscribe: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref5, info) {
                var pubsub = _ref5.pubsub,
                    request = _ref5.request,
                    prisma = _ref5.prisma;
                var userId, user;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                userId = (0, _getUserId2.default)(request);
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

                                throw new Error('The provided user was not found.');

                            case 6:
                                return _context2.abrupt('return', pubsub.asyncIterator('user:' + user.id));

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function subscribe(_x5, _x6, _x7, _x8) {
                return _ref6.apply(this, arguments);
            }

            return subscribe;
        }()
    }

};

exports.default = Subscription;