const jwt = require('jsonwebtoken')

const token = jwt.sign({ data : "This is my encoded payload!" }, 'myscret')
console.log('Encoded token', token)

const payload = jwt.decode(token)
console.log('Decoded payload', payload)

const verified = jwt.verify(token, 'myscret')
console.log('Verified', verified)