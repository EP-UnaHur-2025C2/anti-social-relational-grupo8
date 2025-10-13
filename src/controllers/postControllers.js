const { User, Post } = require('../db/models')

const crearPublicacion = async (req, res) => {
    try {
        const user = req.user               // viene del middleware
        const { texto } = req.body
        const post = await Post.create({
            texto,
            userId: user.id
        })
        res.status(201).json(post)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const obtenerPostsDeUsuario = async (req, res) => {
  try {
    const userId = req.params.userId     // si se hacen middlewares viene de ahi
    const months = 6// se maneja con variable de entorno
    const fechaLimite = new Date()
    fechaLimite.setMonth(fechaLimite.getMonth() - months)
    const posts = await Post.findAll({
      where: { idUser: userId }, // filtra por id
      
    })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
    crearPublicacion,
    
}