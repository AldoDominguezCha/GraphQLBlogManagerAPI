'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _getUserId = require('./../utils/getUserId');

var _getUserId2 = _interopRequireDefault(_getUserId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var User = {
    email: function email(parent, args, _ref, info) {
        var prisma = _ref.prisma,
            request = _ref.request;

        var userId = (0, _getUserId2.default)(request, false);

        if (userId === parent.id) return parent.email;
        return null;
    },
    posts: function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref2, info) {
            var prisma = _ref2.prisma;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return prisma.post.findMany({
                                where: {
                                    AND: [{
                                        authorId: parent.id
                                    }, {
                                        published: true
                                    }]
                                }
                            });

                        case 2:
                            return _context.abrupt('return', _context.sent);

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function posts(_x, _x2, _x3, _x4) {
            return _ref3.apply(this, arguments);
        }

        return posts;
    }(),
    comments: function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref4, info) {
            var prisma = _ref4.prisma;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return prisma.comment.findMany({
                                where: {
                                    authorId: parent.id
                                }
                            });

                        case 2:
                            return _context2.abrupt('return', _context2.sent);

                        case 3:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function comments(_x5, _x6, _x7, _x8) {
            return _ref5.apply(this, arguments);
        }

        return comments;
    }()
};

exports.default = User;