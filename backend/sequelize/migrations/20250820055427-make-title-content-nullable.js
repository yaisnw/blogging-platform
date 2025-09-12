'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('posts', 'title', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('posts', 'content', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('posts', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('posts', 'content', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  }
};
