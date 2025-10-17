const Joi = require('joi');
const { Tag } = require('../db/models');


const tagSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.base': 'El nombre debe ser texto',
      'string.empty': 'El nombre no puede estar vacío',
      'string.min': 'El nombre debe tener al menos 1 carácter',
      'string.max': 'El nombre no puede exceder 50 caracteres',
      'any.required': 'El campo name es obligatorio'
    })
})

const validateTag = (req, res, next) => {
    const { error } = tagSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ errors: error.details.map((d) => d.message) });
    }

    next();
};

const validateTagNoExiste = async (req, res, next) => {
  try {
    const { name } = req.body

    const existente = await Tag.findOne({ where: { name } })
    if (existente) {
      return res.status(409).json({ message: `La etiqueta "${name}" ya existe.` })
    }

    next()
  } catch (err) {
    console.error('Error validarTagNoExiste:', err)
    res.status(500).json({ message: 'Error interno al validar etiqueta.', details: err.message })
  }
}



const validateExisteTag = async (req, res, next) => {
    const { idTag } = req.params;

    try {
        const tag = await Tag.findByPk(idTag);

        if (!tag) {
            return res.status(404).json({ message: `Etiqueta con ID ${idTag} no encontrada.` });
        }

        req.tag = tag;
        next();
    } catch (error) {
        console.error('Error al validar existencia de etiqueta:', error);
        res.status(500).json({ errors: ['Error interno del servidor.'] });
    }
};


module.exports = {
    validateTag,
    validateExisteTag,
    validateTagNoExiste
};