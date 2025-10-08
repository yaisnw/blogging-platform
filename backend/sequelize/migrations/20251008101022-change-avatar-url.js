'use strict';
require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'avatar_url', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: process.env.DEFAULT_AVATAR || null,
      comment: 'Updated URL of the user’s profile picture stored on S3',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'avatar_url', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },
};
