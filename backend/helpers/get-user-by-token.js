const jwt = require('jsonwebtoken')

const User = require('../models/user')

//get user by jwt token
const getUserByToken = async (token) => {
    if (!token) {
        throw new Error('Token de acesso ausente')
    }

    try {
        const decoded = jwt.verify(token, 'nossosecret')
        const userId = decoded.id 
        const user = await User.findOne({_id: userId})
        return user
    } catch (error) {
        throw new Error('Token JWT inválido')
    }
}


module.exports = getUserByToken