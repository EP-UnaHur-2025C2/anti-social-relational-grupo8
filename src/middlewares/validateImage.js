const Joi = require('joi');
const { Post, PostImage } = require('../db/models');

const imageSchema = Joi.object({
  idPost: Joi.number().integer().required().messages({
    "number.base": "El ID del post debe ser un número",
    "any.required": "Debe indicar a qué post pertenece la imagen",
  }),
  imageUrls: Joi.array().items(
    Joi.string().uri().required().messages({
      "string.uri": "Cada URL debe ser válida",
      "any.required": "Cada URL es obligatoria"
    })
  ).min(1).required().messages({
    "array.base": "Se requiere un array de imageUrls válidas",
    "array.min": "Debe enviar al menos una URL"
  }),
});

const validarImagen = (req, res, next) => {
  if (!req.body.idPost && req.params.idPost) {
    req.body.idPost = parseInt(req.params.idPost);
  }

  const { error, value } = imageSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const mensajes = error.details.map((err) => err.message);
    return res.status(400).json({ errors: mensajes });
  }
  req.body = value;
  next();
};

const validarPostExistente = async (req, res, next) => {
  try {
    const { idPost } = req.body;
    const post = await Post.findByPk(idPost);
    if (!post) {
      return res.status(404).json({ error: "El post asociado no existe" });
    }
    req.post = post;
    next();
  } catch (err) {
    res.status(500).json({ error: "Error al verificar el post" });
  }
};

const validarImagenDuplicada = async (req, res, next) => {
  try {
    const { imageUrls } = req.body;

    for (const url of imageUrls) {
      const imagenExistente = await PostImage.findOne({ where: { imageUrl: url } });
      if (imagenExistente) {
        return res.status(400).json({ error: `Ya existe una imagen con la URL: ${url}` });
      }
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Error al verificar las imágenes" });
  }
};

module.exports = {
  validarImagen,
  validarPostExistente,
  validarImagenDuplicada,
};