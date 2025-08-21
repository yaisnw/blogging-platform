'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_posts_status" ADD VALUE IF NOT EXISTS 'completed';
    `);

    await queryInterface.sequelize.query(`
      UPDATE posts SET status = 'completed' WHERE status = 'uploaded';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE posts SET status = 'uploaded' WHERE status = 'completed';
    `);
  }
};
