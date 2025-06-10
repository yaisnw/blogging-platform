'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('pictures', 'picture', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('pictures', 'picture', {
      type: Sequelize.BLOB,
      allowNull: false,
    });
  }
};