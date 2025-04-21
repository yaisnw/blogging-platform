"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const decorators_legacy_1 = require("@sequelize/core/decorators-legacy");
const core_1 = require("@sequelize/core");
const user_1 = require("./user");
const post_1 = require("./post");
class Comment extends core_1.Model {
}
exports.Comment = Comment;
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.INTEGER),
    decorators_legacy_1.AutoIncrement,
    decorators_legacy_1.PrimaryKey
], Comment.prototype, "id", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.INTEGER),
    decorators_legacy_1.NotNull
], Comment.prototype, "authorId", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.INTEGER),
    decorators_legacy_1.NotNull
], Comment.prototype, "postId", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.TEXT),
    decorators_legacy_1.NotNull
], Comment.prototype, "content", void 0);
__decorate([
    (0, decorators_legacy_1.BelongsTo)(() => user_1.User, 'authorId')
], Comment.prototype, "author", void 0);
__decorate([
    (0, decorators_legacy_1.BelongsTo)(() => post_1.Post, 'postId')
], Comment.prototype, "post", void 0);
