'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
};