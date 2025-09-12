'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'avatar_url', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue:
        'https://blogplatform-images.s3.us-east-1.amazonaws.com/avatars/user-svgrepo-com.svg',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatar_url');
  },
};
