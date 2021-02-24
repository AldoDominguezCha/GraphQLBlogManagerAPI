'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateToken = function generateToken(id) {
    if (!id) throw new Error('To generate a JSON web token you must provide the user ID.');
    return _jsonwebtoken2.default.sign({ userId: id }, process.env.SECRET);
};

exports.default = generateToken;