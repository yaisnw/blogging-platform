import {
    Attribute, PrimaryKey, AutoIncrement, NotNull,
    BelongsTo,
    Default,
    HasMany
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
import { Comment } from "./comment";
import { Post } from "./post";

export class Picture extends Model<InferAttributes<Picture>, InferCreationAttributes<Picture>> {

@Attribute(DataTypes.INTEGER)
@PrimaryKey
@AutoIncrement
declare id: CreationOptional<number>;

@Attribute(DataTypes.INTEGER)
@NotNull
declare postId: number;

@Attribute(DataTypes.BLOB)
@NotNull
declare picture: Buffer;

@BelongsTo(()=> Post, "postId")
declare post: NonAttribute<Post>;

}