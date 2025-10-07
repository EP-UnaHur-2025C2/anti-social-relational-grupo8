const { User } = require('../db/models')

const crearUser = async (req, res) => {
    try {
        const { nickname } = req.body
        const user = await User.create({
            nickname
        })
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.messages })
    }
}

const obtenerUsers = async (req , res) => {
    const user = await User.findAll()
    res.json(user)
}

module.exports = {
    crearUser,
    obtenerUsers
}