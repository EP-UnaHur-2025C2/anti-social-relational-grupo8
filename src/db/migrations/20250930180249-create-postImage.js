'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PostImages', {
      idImage: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idPost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Posts', // nombre exacto de la tabla de Posts
          key: 'idPost'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
      
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PostImages');
  }
};
