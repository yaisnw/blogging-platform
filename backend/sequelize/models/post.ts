import { Model, DataTypes, Sequelize } from 'sequelize';

export class Post extends Model {
  public id!: number;
  public authorId!: number;
  public title!: string;
  public content!: string;
  public status!: 'published' | 'draft';

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
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('published', 'draft'),
        allowNull: false,
        defaultValue: 'draft',
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
      validate: {
        uploadedMustHaveContent(this: Post) {
          if (
            this.status === "published" &&
            (!this.content || this.content.trim() === "")
          ) {
            throw new Error("Uploaded posts must have content.");
          }
        },
      },
    },

  );
}
