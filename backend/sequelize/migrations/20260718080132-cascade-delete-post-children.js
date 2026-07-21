'use strict';

/**
 * The live DB was created with these FKs as ON DELETE NO ACTION (the tables
 * predate the CASCADE declared in the create-pictures migration — an early
 * sync() built them out of sync). That blocks deleting any post that has a
 * picture/comment/like. This migration rewrites each FK to ON DELETE CASCADE
 * so deleting a post removes its child ROWS. (S3 files are handled separately
 * in the controller — cascade only affects database rows.)
 *
 * @type {import('sequelize-cli').Migration}
 */

const CHILDREN = [
  { table: 'pictures', constraint: 'pictures_postId_fkey' },
  { table: 'comments', constraint: 'comments_postId_fkey' },
  { table: 'likes', constraint: 'likes_postId_fkey' },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const { table, constraint } of CHILDREN) {
      await queryInterface.removeConstraint(table, constraint);
      await queryInterface.addConstraint(table, {
        fields: ['postId'],
        type: 'foreign key',
        name: constraint,
        references: { table: 'posts', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    for (const { table, constraint } of CHILDREN) {
      await queryInterface.removeConstraint(table, constraint);
      await queryInterface.addConstraint(table, {
        fields: ['postId'],
        type: 'foreign key',
        name: constraint,
        references: { table: 'posts', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION',
      });
    }
  },
};
