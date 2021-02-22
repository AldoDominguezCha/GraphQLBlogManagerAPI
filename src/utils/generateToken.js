import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    if(!id)
        throw new Error('To generate a JSON web token you must provide the user ID.')
    return jwt.sign({ userId : id }, 'secret')
}

export { generateToken as default }