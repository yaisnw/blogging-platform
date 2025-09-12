'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_posts_status_new" AS ENUM ('draft', 'published');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      ALTER COLUMN "status" DROP DEFAULT;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      ALTER COLUMN "status"
      TYPE "enum_posts_status_new"
      USING (
        CASE
          WHEN "status" = 'pending' THEN 'draft'::text
          WHEN "status" = 'completed' THEN 'published'::text
          ELSE 'draft'::text
        END
      )::"enum_posts_status_new";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      ALTER COLUMN "status" SET DEFAULT 'draft';
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE "enum_posts_status_old";
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_posts_status_new" RENAME TO "enum_posts_status";
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_posts_status_old" AS ENUM ('uploaded', 'pending', 'completed');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      ALTER COLUMN "status" DROP DEFAULT;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      ALTER COLUMN "status"
      TYPE "enum_posts_status_old"
      USING (
        CASE
          WHEN "status" = 'draft' THEN 'pending'::text
          WHEN "status" = 'published' THEN 'completed'::text
          ELSE 'pending'::text
        END
      )::"enum_posts_status_old";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      ALTER COLUMN "status" SET DEFAULT 'pending';
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE "enum_posts_status";
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_posts_status_old" RENAME TO "enum_posts_status";
    `);
  }
};
