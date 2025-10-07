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

const obtenerUser = async (req , res) => {
    const user = await User.findByPK(req.params.id)
    if (!user) return res.status(404).json({ message: 'usuario no encontrado' })
    res.json(user)
}

const actualizarUser = async (req , res) => {
    const user = await User.findByPK(req.params.id)
    if (!user) return res.status(404).json({ message: 'usuario no encontrado' })
    await actor.update(req.body)
    res.json(user)
}

const eliminarUser = async (req , res) => {
    const user = await User.findByPK(req.params.id)
    if (!user) return res.status(404).json({ message: 'usuario no encontrado' })
    await actor.destroy()
    res.json({ message: 'Usuario eliminado correctamente' })
}

module.exports = {
    crearUser,
    obtenerUsers,
    obtenerUser,
    actualizarUser,
    eliminarUser
}