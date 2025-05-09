import { Sequelize } from 'sequelize';
import { User, initUser } from './user';
import { Post, initPost } from './post';
import { Comment, initComment } from './comment';
import { Picture, initPicture } from './picture';

export function initModels(sequelize: Sequelize) {
  initUser(sequelize);
  initPost(sequelize);
  initComment(sequelize);
  initPicture(sequelize);

  User.hasMany(Post, { foreignKey: 'authorId' });
  User.hasMany(Comment, { foreignKey: 'authorId' });

  Post.belongsTo(User, { foreignKey: 'authorId' });
  Post.hasMany(Comment, { foreignKey: 'postId' });
  Post.hasMany(Picture, { foreignKey: 'postId' });

  Comment.belongsTo(User, { foreignKey: 'authorId' });
  Comment.belongsTo(Post, { foreignKey: 'postId' });

  Picture.belongsTo(Post, { foreignKey: 'postId' });
}

export { User, Post, Comment, Picture };
