import { Model, DataTypes, Sequelize } from 'sequelize';

export class Post extends Model {
  public id!: number;
  public authorId!: number;
  public title!: string;
  public content!: string;
  public status!: 'uploaded' | 'pending';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initPost(sequelize: Sequelize) {
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('uploaded', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
      },
      likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: 'posts',
      modelName: 'Post',
    }
  );
}
