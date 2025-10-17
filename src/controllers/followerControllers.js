const { User, sequelize } = require('../db/models');
const ATRIBUTOS_EXCLUIDOS_USER = ['password', 'email', 'updatedAt'];

// GESTIÓN DE RELACIONES

// SEGUIR USUARIO
const seguirUsuario = async (req, res) => {
    const { followerId, followingId } = req.params;

    if (followerId === followingId) {
        return res.status(400).json({ message: 'Un usuario no puede seguirse a sí mismo.' });
    }

    try {
        const follower = await User.findByPk(followerId);
        const following = await User.findByPk(followingId);

        if (!follower || !following) {
            return res.status(404).json({ message: 'Uno o ambos usuarios no fueron encontrados.' });
        }

        await follower.addFollowing(followingId);

        res.status(201).json({ 
            message: `Usuario ${followerId} ahora sigue a ${followingId}.`,
            followerId: parseInt(followerId),
            followingId: parseInt(followingId)
        });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ message: 'El usuario ya sigue a este otro usuario.' });
        }
        res.status(500).json({ message: 'Error al seguir al usuario.', error: error.message });
    }
};

// DEJAR DE SEGUIR USUARIO 
const dejarDeSeguirUsuario = async (req, res) => {
    const { followerId, followingId } = req.params;

    try {
        const follower = await User.findByPk(followerId);
        const following = await User.findByPk(followingId);

        if (!follower || !following) {
            return res.status(404).json({ message: 'Uno o ambos usuarios no fueron encontrados.' });
        }

        const resultado = await follower.removeFollowing(followingId);

        if (resultado === 0) {
            return res.status(404).json({ message: 'La relación de seguimiento no existía.' });
        }

        res.status(204).send(); 

    } catch (error) {
        res.status(500).json({ message: 'Error al dejar de seguir al usuario.', error: error.message });
    }
};


// FUNCIONES DE LECTURA (LISTAS)

// OBTENER LISTA DE SEGUIDOS
const obtenerSeguidos = async (req, res) => {
    const { followerId } = req.params;

    try {
        const usuario = await User.findByPk(followerId, {
            attributes: ['idUser', 'nickName'],
            include: [{
                model: sequelize.models.User,
                as: 'Followings', 
                attributes: { exclude: ATRIBUTOS_EXCLUIDOS_USER },
                through: { attributes: [] } 
            }]
        });

        if (!usuario) {
            return res.status(404).json({ message: `Usuario con ID ${followerId} no encontrado.` });
        }
        
        res.status(200).json({
            idUser: usuario.idUser,
            nickName: usuario.nickName,
            followings: usuario.Followings
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de seguidos.', error: error.message });
    }
};

// OBTENER LISTA DE SEGUIDORES
const obtenerSeguidores = async (req, res) => {
    const { followingId } = req.params;

    try {
        const usuario = await User.findByPk(followingId, {
            attributes: ['idUser', 'nickName'],
            include: [{
                model: sequelize.models.User,
                as: 'Followers', // Alias definido en el modelo User
                attributes: { exclude: ATRIBUTOS_EXCLUIDOS_USER },
                through: { attributes: [] }
            }]
        });

        if (!usuario) {
            return res.status(404).json({ message: `Usuario con ID ${followingId} no encontrado.` });
        }

        res.status(200).json({
            idUser: usuario.idUser,
            nickName: usuario.nickName,
            followers: usuario.Followers
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de seguidores.', error: error.message });
    }
};


module.exports = {
    seguirUsuario,
    dejarDeSeguirUsuario,
    obtenerSeguidos,
    obtenerSeguidores
};