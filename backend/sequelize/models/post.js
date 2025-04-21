"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const decorators_legacy_1 = require("@sequelize/core/decorators-legacy");
const core_1 = require("@sequelize/core");
const user_1 = require("./user");
const comment_1 = require("./comment");
const picture_1 = require("./picture");
class Post extends core_1.Model {
}
exports.Post = Post;
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.INTEGER),
    decorators_legacy_1.PrimaryKey,
    decorators_legacy_1.AutoIncrement
], Post.prototype, "id", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.INTEGER),
    decorators_legacy_1.NotNull
], Post.prototype, "authorId", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.TEXT),
    decorators_legacy_1.NotNull
], Post.prototype, "title", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.TEXT),
    decorators_legacy_1.NotNull
], Post.prototype, "content", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.ENUM('uploaded', 'pending')),
    (0, decorators_legacy_1.Default)('pending')
], Post.prototype, "status", void 0);
__decorate([
    (0, decorators_legacy_1.HasMany)(() => comment_1.Comment, "postId")
], Post.prototype, "comments", void 0);
__decorate([
    (0, decorators_legacy_1.HasMany)(() => picture_1.Picture, "postId")
], Post.prototype, "pictures", void 0);
__decorate([
    (0, decorators_legacy_1.BelongsTo)(() => user_1.User, "authorId")
], Post.prototype, "author", void 0);
