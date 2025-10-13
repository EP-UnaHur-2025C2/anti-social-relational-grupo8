// middlewares/validarPostBody.js
const Joi = require('joi')
const { User } = require('../db/models')

const descriptionParamSchema = Joi.object({
  description: Joi.string()
    .trim()
    .min(3)
    .max(500)
    .required()
    .messages({
      'string.base': 'La descripción debe ser texto',
      'string.empty': 'La descripción no puede estar vacía',
      'string.min': 'La descripción debe tener al menos 3 caracteres',
      'string.max': 'La descripción no puede tener más de 500 caracteres',
      'any.required': 'La descripción es obligatoria'
    })
})

const validarPost = (req, res, next) => {
  const { error } = descriptionParamSchema.validate(req.body, { abortEarly: false })

  if (error) {
    const mensajes = error.details.map((d) => d.message)
    return res.status(400).json({ errors: mensajes })
  }

  next()
}


const validarUsuarioExiste = async (req, res, next) => {
  try {
    const userId = req.params.userId
    if (!userId) return res.status(400).json({ message: 'Falta userId en params' })

    const user = await User.findByPk(userId)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    req.user = user
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  validarPost,
  validarUsuarioExiste
}