import { Sequelize } from 'sequelize';
import { User, initUser } from './User.js';
import { Post, initPost } from './Post.js';
import { Comment, initComment } from './Comment.js';
import { Picture, initPicture } from './Picture.js';
import { Like, initLike } from './Like.js'
export function initModels(sequelize: Sequelize) {
  initUser(sequelize);
  initPost(sequelize);
  initComment(sequelize);
  initPicture(sequelize);
  initLike(sequelize);

  User.hasMany(Post, { foreignKey: 'authorId' });
  User.hasMany(Comment, { foreignKey: 'authorId' });
  User.hasMany(Like, { foreignKey: 'authorId' }); 

  Post.belongsTo(User, { foreignKey: 'authorId' });
  // onDelete CASCADE matches the live FK constraints (see migration
  // 20260718080132-cascade-delete-post-children). Deleting a post removes its
  // child rows; S3 files are cleaned up separately in postController.
  Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
  Post.hasMany(Picture, { foreignKey: 'postId', onDelete: 'CASCADE' });
  Post.hasMany(Like, { foreignKey: 'postId', onDelete: 'CASCADE' });

  Comment.belongsTo(User, { foreignKey: 'authorId' });
  Comment.belongsTo(Post, { foreignKey: 'postId' });

  Picture.belongsTo(Post, { foreignKey: 'postId' }); 
  Like.belongsTo(User, { foreignKey: 'authorId' }); 
  Like.belongsTo(Post, { foreignKey: 'postId' });
}

export { User, Post, Comment, Picture, Like };
