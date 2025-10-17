"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 1. Relación 1:M con Post
      User.hasMany(models.Post, {
        foreignKey: "idUser",
        as: "posts",
      });

      // 2. Relación 1:M con Comment
      User.hasMany(models.Comment, {
        foreignKey: "idUser",
        as: "comments",
      });

      // BONUS:

      // Usuario que está siguiendo a otros
      User.belongsToMany(models.User, {
        as: "Followings", // Usuarios que sigo
        through: "UserFollowings", // Tabla intermedia
        foreignKey: "followerId", // Yo soy el seguidor
        otherKey: "followingId", // El otro es el seguido
      });

      User.belongsToMany(models.User, {
        as: "Followers", // Usuarios que me siguen
        through: "UserFollowers", // Tabla intermedia
        foreignKey: "followingId", // Yo soy el seguido
        otherKey: "followerId", // El otro es el seguidor
      });
    }
  }

  User.init(
    {
      idUser: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nickName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );
  return User;
};
