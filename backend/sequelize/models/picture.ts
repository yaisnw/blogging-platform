import { Model, DataTypes, Sequelize } from 'sequelize';
export class Picture extends Model {
  public id!: number;
  public postId!: number;
  public imageUrl!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initPicture(sequelize: Sequelize) {
  Picture.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'pictures',
      modelName: 'Picture',
    }
  );
}
