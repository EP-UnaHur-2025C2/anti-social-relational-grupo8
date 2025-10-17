const Joi = require('joi');
const { User } = require('../db/models');

const createUserSchema = Joi.object({
  nickName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'El nickName debe ser texto.',
      'string.empty': 'El nickName no puede estar vacío.',
      'string.min': 'El nickName debe tener al menos 3 caracteres.',
      'string.max': 'El nickName no puede tener más de 30 caracteres.',
      'any.required': 'El nickName es obligatorio.'
    }),

  firstName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El firstName no puede tener más de 50 caracteres.'
    }),

  lastName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El lastName no puede tener más de 50 caracteres.'
    }),

  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido.',
      'any.required': 'El email es obligatorio.'
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.min': 'La password debe tener al menos 6 caracteres.',
      'any.required': 'La password es obligatoria.'
    })
})

const validarCreacionUsuario = (req, res, next) => {
  const { error, value } = createUserSchema.validate(req.body,{ abortEarly: false, stripUnknown: true });

  if (error) {
    const mensajes = error.details.map((d) => d.message);
    return res.status(400).json({ errors: mensajes });
  }

  req.body = value; 
  next();
};

const validarUnicidadNickName = async (req, res, next) => {
  const { nickName } = req.body;

  try {
    const usuarioExistente = await User.findOne({
      where: { nickName }
    });

    if (usuarioExistente) {
      return res.status(400).json({ errors: ['El nickName ya está en uso.'] });
    }

    next();
  } catch (err) {
    console.error('Error al validar unicidad:', err);
    res.status(500).json({ message: 'Error interno al validar usuario.', details: err.message });
  }
};

const validarUnicidadMail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const mailExistente = await User.findOne({
      where: { email }
    });

    if (mailExistente) {
      return res.status(400).json({ errors: ['El email ya está en uso.'] });
    }

    next();
  } catch (err) {
    console.error('Error al validar unicidad:', err);
    res.status(500).json({ message: 'Error interno al validar usuario.', details: err.message });
  }
};

const validarUsuarioExiste = async (req, res, next) => {
  try {
    const { idUser } = req.params
    const user = await User.findByPk(idUser)

    if (!user) return res.status(404).json({ message: `Usuario con ID ${idUser} no encontrado.`  })

    req.user = user
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createUpdateUserSchema = Joi.object({
 nickName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .optional()
    .messages({
      'string.base': 'El nickName debe ser texto.',
      'string.empty': 'El nickName no puede estar vacío.',
      'string.min': 'El nickName debe tener al menos 3 caracteres.',
      'string.max': 'El nickName no puede tener más de 30 caracteres.',
      'any.required': 'El nickName es obligatorio.'
    }),

  firstName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El firstName no puede tener más de 50 caracteres.'
    }),

  lastName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El lastName no puede tener más de 50 caracteres.'
    }),

  email: Joi.string()
    .trim()
    .email()
    .optional()
    .messages({
      'string.email': 'El email debe tener un formato válido.',
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .optional()
    .messages({
      'string.min': 'La password debe tener al menos 6 caracteres.',
    })
})

const validarUpdateUsuario = (req, res, next) => {
  const { error, value } = createUpdateUserSchema.validate(req.body,{ abortEarly: false, stripUnknown: true });

  if (error) {
    const mensajes = error.details.map((d) => d.message);
    return res.status(400).json({ errors: mensajes });
  }

  req.body = value;
  next();
};

const validarEmailUpdate = async (req, res, next) => {
    const { email } = req.body;

    if (typeof email === 'undefined') {
      return next()
    }

    try {
        const usuarioExistente = await User.findOne({
            where: { email }
        });

        if (usuarioExistente) {
            return res.status(400).json({ errors: ['El email ya está en uso.'] });
        }

        next();
    } catch (err) {
        console.error('Error al validar unicidad:', err);
        res.status(500).json({ message: 'Error interno al validar usuario.', details: err.message });
    }
};


const validarNickNameUpdate = async (req, res, next) => {
    const { nickName } = req.body;

    if (typeof nickName === 'undefined') {
        return next();
    }

    try {
        const usuarioExistente = await User.findOne({
            where: { nickName }
        });

        if (usuarioExistente) {
            return res.status(400).json({ errors: ['El nickName ya está en uso.'] });
        }

        next();
    } catch (err) {
        console.error('Error al validar unicidad:', err);
        res.status(500).json({ message: 'Error interno al validar usuario.', details: err.message });
    }
};

module.exports = {
    validarCreacionUsuario,
    validarUnicidadNickName,
    validarUnicidadMail,
    validarUsuarioExiste,
    validarUpdateUsuario,
    validarEmailUpdate,
    validarNickNameUpdate
};