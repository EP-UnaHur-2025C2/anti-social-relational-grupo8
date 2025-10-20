const { User } = require('../db/models')
const { UniqueConstraintError } = require('sequelize');
const ATRIBUTOS_EXCLUIDOS = ['updatedAt']; 

// 1. CREAR USUARIO 
const crearUsuario = async (req, res) => {
    const { nickName, firstName, lastName, email, password } = req.body; 
    try {
        const nuevoUsuario = await User.create({
            nickName,
            firstName,
            lastName,
            email,
            password 
        });

        const usuarioRespuesta = nuevoUsuario.toJSON();
        delete usuarioRespuesta.password;

        res.status(201).json(usuarioRespuesta);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno al crear el usuario.', details: error.message });
    }
};

// 2. OBTENER TODOS LOS USUARIOS 
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await User.findAll({
            attributes: { exclude: ['password', ...ATRIBUTOS_EXCLUIDOS] }
        });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de usuarios.', details: error.message });
    }
};

// 3. OBTENER UN USUARIO POR ID 
const obtenerUsuario = async (req, res) => {
    const { idUser } = req.params; 
    try {
        const usuario = await User.findByPk(idUser, { 
            attributes: { exclude: ['password', ...ATRIBUTOS_EXCLUIDOS] } 
        });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener el usuario con ID ${idUser}.`, details: error.message });
    }
};

// 4. ACTUALIZAR USUARIO 
const actualizarUsuario = async (req, res) => {
    const { idUser } = req.params;
    const updateData = req.body;

    try {
        let usuario = await User.findByPk(idUser);
        delete updateData.idUser;

        usuario = await usuario.update(updateData);
        
        const usuarioRespuesta = usuario.toJSON();
        delete usuarioRespuesta.password;

        res.status(200).json(usuarioRespuesta);

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario.', details: error.message });
    }
};

// 5. ELIMINAR USUARIO
const eliminarUsuario = async (req, res) => {
    const { idUser } = req.params;
    try {
        await User.destroy({
            where: { idUser }
        });

        res.status(200).json({ message: `Etiqueta ID: ${idUser} eliminada del post correctamente.` });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar el usuario. Revise si tiene publicaciones/comentarios asociados.', 
            error: error.message 
        });
    }
};

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario
};  