'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 1. Relación 1:M con Post
      User.hasMany(models.Post, {
        foreignKey: "idUser", 
        as: "posts"
      });
      
      // 2. Relación 1:M con Comment
      User.hasMany(models.Comment, {
        foreignKey: "idUser",
        as: "comments"
      });

      // BONUS:

      // Usuario que está siguiendo a otros 
      User.belongsToMany(models.User, {
          as: 'Followings',       
          through: 'Followers',   
          foreignKey: 'followerId', 
      });
      // Usuario que es seguido por otros 
      User.belongsToMany(models.User, {
          as: 'Followers',        
          through: 'Followers',
          foreignKey: 'followingId',
      });
    }
  }
  
  User.init({
    idUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nickName: { 
      type: DataTypes.STRING,
      unique: true, 
      allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true, 
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', 
    timestamps: true 
  });
  return User;
};



/*'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post,
        {
          foreignKey: "userId",
          as: "posts"
        }
      )
    }
  }
  User.init({
    nickname: {
      type: DataTypes.STRING,
      unique:true,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps:false
  });
  return User;
};*/