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
  Post.hasMany(Comment, { foreignKey: 'postId' });
  Post.hasMany(Picture, { foreignKey: 'postId' });
  Post.hasMany(Like, { foreignKey: 'postId' });

  Comment.belongsTo(User, { foreignKey: 'authorId' });
  Comment.belongsTo(Post, { foreignKey: 'postId' });

  Picture.belongsTo(Post, { foreignKey: 'postId' }); 
  Like.belongsTo(User, { foreignKey: 'authorId' }); 
  Like.belongsTo(Post, { foreignKey: 'postId' });
}

export { User, Post, Comment, Picture, Like };
