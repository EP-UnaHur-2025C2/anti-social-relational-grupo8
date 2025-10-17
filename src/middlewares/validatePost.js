const Joi = require('joi');
const { Post, User } = require('../db/models');


const postSchema = Joi.object({
    description: Joi.string().min(10).required().messages({
        "string.empty": "La descripción no puede estar vacía",
        "string.min": "La descripción debe tener al menos 10 caracteres",
        "any.required": "La descripción es obligatoria",
    }),
    userId: Joi.number().integer().required().messages({
        "number.base": "El ID de usuario debe ser un número",
        "any.required": "Debe indicar a qué usuario pertenece el post",
    }),
});

const validarPost = (req,res,next) => {
    const {error}= postSchema.validate(req.body, {abortEarly: false});

    if (error){
        const mensajes = error.details.map((err)=>err.message);
        return res.status(400).json({error:mensajes});
    }

    next();
};

const validarUsuarioExistente= async(req,res,next)=>{
    const {userId}= req.body;
    
    try{
        const usuario= await User.findByPk(userId);
        if (!usuario){
            return res.status(404).json({error:"El usuario no existe"});
        }
        next();
    } catch (err){
        res.status(500).json({error:"Error al verificar el usuario"});
    }
};

const validarDescripcionUnica = async (req, res, next) => {
    const { description } = req.body;

    try {
        const postExistente = await Post.findOne({ where: { description } });
        if (postExistente) {
            return res.status(400).json({ error: "Ya existe un post con esa descripción" });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al verificar la descripción del post" });
    }
};

const validarPostExistente = async (req, res, next) => {
    const { idPost } = req.params;

    try {
        const post = await Post.findByPk(idPost);
        if (!post) {
            return res.status(404).json({ error: `Post con ID ${idPost} no encontrado` });
        }
        req.post = post;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al verificar el post" });
    }
};

module.exports = {
  validarPost,
  validarUsuarioExistente,
  validarDescripcionUnica,
  validarPostExistente,
};