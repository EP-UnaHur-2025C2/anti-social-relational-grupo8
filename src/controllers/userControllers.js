const { User } = require('../db/models')
const { User } = require('../models'); 
const { UniqueConstraintError } = require('sequelize');

const ATRIBUTOS_EXCLUIDOS = ['updatedAt']; 

// 1. CREAR USUARIO 
const crearUsuario = async (req, res) => {
    const { nickName, firstName, lastName, email, password } = req.body; 

    if (!nickName || !email || !password) {
        return res.status(400).json({ message: 'Faltan campos obligatorios: nickName, email y password.' });
    }

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
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: 'El nickName o email ya está registrado.' });
        }
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

        if (!usuario) {
            return res.status(404).json({ message: `Usuario con ID ${idUser} no encontrado.` });
        }
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

        if (!usuario) {
            return res.status(404).json({ message: `Usuario con ID ${idUser} no encontrado.` });
        }
        
        delete updateData.idUser;

        usuario = await usuario.update(updateData);
        
        const usuarioRespuesta = usuario.toJSON();
        delete usuarioRespuesta.password;

        res.status(200).json(usuarioRespuesta);

    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: 'El nickName o email proporcionado ya está en uso.' });
        }
        res.status(500).json({ message: 'Error al actualizar el usuario.', details: error.message });
    }
};

// 5. ELIMINAR USUARIO
const eliminarUsuario = async (req, res) => {
    const { idUser } = req.params;
    try {
        const filasEliminadas = await User.destroy({
            where: { idUser }
        });

        if (filasEliminadas === 0) {
            return res.status(404).json({ message: `Usuario con ID ${idUser} no encontrado.` });
        }

        res.status(204).send(); 
        
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

/*
const { User } = require('../db/models')

const crearUser = async (req, res) => {
    try {
        const { nickname } = req.body
        const user = await User.create({
            nickname
        })
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.messages })
    }
}

const obtenerUsers = async (req , res) => {
    const user = await User.findAll()
    res.json(user)
}

const obtenerUser = async (req , res) => {
    const user = await User.findByPK(req.params.id)
    if (!user) return res.status(404).json({ message: 'usuario no encontrado' })
    res.json(user)
}

const actualizarUser = async (req , res) => {
    const user = await User.findByPK(req.params.id)
    if (!user) return res.status(404).json({ message: 'usuario no encontrado' })
    await user.update(req.body)
    res.json(user)
}

const eliminarUser = async (req , res) => {
    const user = await User.findByPK(req.params.id)
    if (!user) return res.status(404).json({ message: 'usuario no encontrado' })
    await actor.destroy()
    res.json({ message: 'Usuario eliminado correctamente' })
}

module.exports = {
    crearUser,
    obtenerUsers,
    obtenerUser,
    actualizarUser,
    eliminarUser
}
*/