import {
    Attribute, PrimaryKey, AutoIncrement, NotNull,
    HasMany
} from "@sequelize/core/decorators-legacy"
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
} from '@sequelize/core';
import { Post } from "./post";
import { Comment } from "./comment";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare username: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare password: string;

    @HasMany(()=> Post, 'authorId')
    declare posts?: NonAttribute<Post[]>;

    @HasMany(() => Comment, 'authorId')
    declare comments?: NonAttribute<Comment[]>;
}