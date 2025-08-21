'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make both title and content nullable
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
    // Rollback: make them NOT NULL again
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
