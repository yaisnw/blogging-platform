'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('likes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('likes', {
      fields: ['userId', 'postId'],
      type: 'unique',
      name: 'unique_user_post_like'
    });

    await queryInterface.removeColumn('posts', 'likes');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('likes');

    await queryInterface.addColumn('posts', 'likes', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
  }
};
