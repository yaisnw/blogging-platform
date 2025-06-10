'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('pictures', 'picture', 'imageUrl');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('pictures', 'imageUrl', 'picture');
  }
};
