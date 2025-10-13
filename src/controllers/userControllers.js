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
    const users = await User.findAll()
    res.json(users)
}

const obtenerUser = async (req , res) => {
    res.json(req.user)
}

const actualizarUser = async (req , res) => {
    req.user.update(req.body)
    res.json(req.user)
}

const eliminarUser = async (req , res) => {
    req.user.destroy()
    res.json({ message: 'Usuario eliminado correctamente' })
}

module.exports = {
    crearUser,
    obtenerUsers,
    obtenerUser,
    actualizarUser,
    eliminarUser
}