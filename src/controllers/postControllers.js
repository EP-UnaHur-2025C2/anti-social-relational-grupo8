const { User, Post } = require('../db/models')

const crearPublicacion = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await User.findByPk(userId)
        if (!user) {
            return res.status(400).json({ message: "No se encontro el usuario" })
        }
        const { texto } = req.body
        const post = await Post.create({
            texto,
            userId
        })
        res.status(201).json(post)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    crearPublicacion
}