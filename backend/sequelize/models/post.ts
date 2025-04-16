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
import { Picture } from "./picture";
export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare authorId: number;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare title: string;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare content: string;

    @Attribute(DataTypes.ENUM('uploaded', 'pending'))
    @Default('pending')
    declare status: CreationOptional<string>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    @HasMany(() => Comment, "postId")
    declare comments?: NonAttribute<Comment[]>;

    @HasMany(()=> Picture, "postId")
    declare pictures?: NonAttribute<Picture[]>;

    @BelongsTo(() => User, "authorId")
    declare author: NonAttribute<User>;


}