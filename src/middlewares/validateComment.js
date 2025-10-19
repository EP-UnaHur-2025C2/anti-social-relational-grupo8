const Joi = require('joi')

const createCommentSchema = Joi.object({
  idUser: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El idUser debe ser un número',
      'number.integer': 'El idUser debe ser un número entero',
      'number.positive': 'El idUser debe ser un número positivo',
      'any.required': 'El idUser es obligatorio'
    }),

  idPost: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El idPost debe ser un número',
      'number.integer': 'El idPost debe ser un número entero',
      'number.positive': 'El idPost debe ser un número positivo',
      'any.required': 'El idPost es obligatorio'
    }),

  content: Joi.string()
    .trim()
    .min(1)
    .max(500)
    .required()
    .messages({
      'string.base': 'El contenido debe ser texto',
      'string.empty': 'El comentario no puede estar vacío',
      'string.min': 'El comentario debe tener al menos 1 carácter',
      'string.max': 'El comentario no puede exceder 500 caracteres',
      'any.required': 'El campo content es obligatorio'
    })
})


const validarCrearComentario = (req, res, next) => {
  const { error, value } = commentSchema.validate(req.body)

  if (error) {
    const mensajes = error.details.map(d => d.message)
    return res.status(400).json({ errors: mensajes })
  }

  next()
}

const commentUpdateSchema = Joi.object({
  content: Joi.string()
    .trim()
    .min(1)
    .max(500)
    .required()
    .messages({
      'string.base': 'El campo content debe ser texto',
      'string.empty': 'El campo content no puede estar vacío',
      'string.min': 'El comentario debe tener al menos 1 carácter',
      'string.max': 'El comentario no puede exceder 500 caracteres',
      'any.required': 'El campo content es obligatorio'
    })
})


const validarActualizarComentario = (req, res, next) => {
  const { error, value } = commentUpdateSchema.validate(req.body,{abortEarly: false, allowUnknown: false})

  if (error) {
    const mensajes = error.details.map(d => d.message)
    return res.status(400).json({ errors: mensajes })
  }

  next()
}

const commentExists = async (req, res, next) => {
  try {
    const comentario = await Comment.findByPk(idComment)
    if (!comentario) {
      return res.status(404).json({ message: `Comentario con ID ${idComment} no encontrado.` })
    }

    next()
  } catch (err) {
    console.error('Error validarComentarioExiste:', err)
    res.status(500).json({ message: 'Error interno al validar comentario.', details: err.message })
  }
}
const commentNoExiste = async (req, res, next) => {
  try {
    const comentario = await Comment.findByPk(idComment)
    if (comentario) {
      return res.status(409).json({ message: `Comentario con ID ${idComment} ya existe.` })
    }

    next()
  } catch (err) {
    console.error('Error validarComentarioNoExiste:', err)
    res.status(500).json({ message: 'Error interno al validar comentario.', details: err.message })
  }
}

module.exports = {
    commentExists,
    commentNoExiste,
    validarCrearComentario,
    validarActualizarComentario
}