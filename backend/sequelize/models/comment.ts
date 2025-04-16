import {
    Attribute, PrimaryKey, AutoIncrement, NotNull,
    BelongsTo,
    Default
} from "@sequelize/core/decorators-legacy"
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute
} from '@sequelize/core';
import { User } from "./user";
import { Post } from "./post";

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
    @Attribute(DataTypes.INTEGER)
    @AutoIncrement
    @PrimaryKey
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare authorId: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare postId: number;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare content: string;

    declare createdAt: CreationOptional<Date>;

    @BelongsTo(() => User, 'authorId')
    declare author: NonAttribute<User>;

    @BelongsTo(() => Post, 'postId')
    declare post: NonAttribute<Post>;
}