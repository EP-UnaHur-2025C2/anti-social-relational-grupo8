const Joi = require('joi')
const { User } = require('../db/models')

const nicknameParamSchema = Joi.object({
  nickname: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'El nickname debe ser texto',
      'string.empty': 'El nickname no puede estar vacío',
      'string.min': 'El nickname debe tener al menos 3 caracteres',
      'string.max': 'El nickname no puede tener más de 30 caracteres',
      'any.required': 'El nickname es obligatorio'
    })
})

const validarUser = (req, res, next) => {
  const { error } = nicknameParamSchema.validate(req.body, { abortEarly: false })
  if (error) {
    const mensajes = error.details.map((d) => d.message)
    return res.status(400).json({ errors: mensajes })
  }
  next()
}

const validarUsuarioExiste = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findByPk(id)

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    req.user = user // para que el controlador lo use
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}