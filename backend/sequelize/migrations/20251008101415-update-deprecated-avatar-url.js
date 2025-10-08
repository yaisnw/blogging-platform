'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE users
      SET avatar_url = 'https://blogplatform-images.s3.us-east-1.amazonaws.com/avatars/user-alt-1-svgrepo-com.svg'
      WHERE avatar_url = 'https://blogplatform-images.s3.us-east-1.amazonaws.com/avatars/user-svgrepo-com.svg';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE users
      SET avatar_url = 'https://blogplatform-images.s3.us-east-1.amazonaws.com/avatars/user-svgrepo-com.svg'
      WHERE avatar_url = 'https://blogplatform-images.s3.us-east-1.amazonaws.com/avatars/user-alt-1-svgrepo-com.svg';
    `);
  }
};
