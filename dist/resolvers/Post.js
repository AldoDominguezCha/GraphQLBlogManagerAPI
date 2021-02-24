"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Post = {
    author: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
            var prisma = _ref.prisma;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return prisma.user.findUnique({
                                where: {
                                    id: parent.authorId
                                }
                            });

                        case 2:
                            return _context.abrupt("return", _context.sent);

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function author(_x, _x2, _x3, _x4) {
            return _ref2.apply(this, arguments);
        }

        return author;
    }(),
    comments: function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
            var prisma = _ref3.prisma;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return prisma.comment.findMany({
                                where: {
                                    postId: parent.id
                                }
                            });

                        case 2:
                            return _context2.abrupt("return", _context2.sent);

                        case 3:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function comments(_x5, _x6, _x7, _x8) {
            return _ref4.apply(this, arguments);
        }

        return comments;
    }()
};

exports.default = Post;