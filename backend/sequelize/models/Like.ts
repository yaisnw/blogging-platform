import { Model, DataTypes, Sequelize } from 'sequelize';

export class Like extends Model {
  public id!: number;
  public authorId!: number;
  public postId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initLike(sequelize: Sequelize) {
  Like.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

    },
    {
      sequelize,
      tableName: 'likes',
      modelName: 'Like',
       indexes: [
        {
          unique: true,
          fields: ['userId', 'postId'], 
        },
      ],
    }
  );
}