'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create new enum
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_posts_status_new" AS ENUM ('draft', 'published');
    `);

    // 2. Remove default from column
    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      ALTER COLUMN "status" DROP DEFAULT;
    `);

    // 3. Update column to use new enum with mapping
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

    // 4. Set new default
    await queryInterface.sequelize.query(`
      ALTER TABLE "posts"
      ALTER COLUMN "status" SET DEFAULT 'draft';
    `);

    // 5. Drop old enum
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_posts_status_old";
    `);

    // 6. Rename new enum to match Sequelize's expected type
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_posts_status_new" RENAME TO "enum_posts_status";
    `);
  },

  async down(queryInterface, Sequelize) {
    // Rollback: recreate old type
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_posts_status_old" AS ENUM ('uploaded', 'pending', 'completed');
    `);

    // Drop default first
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

    // Restore default
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
