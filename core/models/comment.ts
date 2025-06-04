import { Realm } from '@realm/react';
import { CommentResponse } from '../hooks/useApi';

export class CommentModel extends Realm.Object {
  id!: number;
  text!: string;
  authorId!: string;
  postId!: number;
  authorFirstName!: string;
  authorLastName!: string;
  authorAvatar?: string;
  createdAt!: Date;
  updatedAt!: Date;

  static fromApi(comment: CommentResponse): CommentModel {
    console.log("Comment: ", comment);
    return {
      id: comment.id,
      text: comment.text,
      authorFirstName: comment.author.firstName,
      authorLastName: comment.author.lastName,
      authorAvatar: comment.author.avatar,
      authorId: comment.author.id,
      postId: comment.post.id,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt)
    } as CommentModel;
  }

  static schema = {
    name: 'Comment',
    primaryKey: 'id',
    properties: {
      id: 'int',
      text: 'string',
      authorFirstName: 'string',
      authorLastName: 'string',
      authorAvatar: 'string?',
      authorId: 'string',
      postId: 'int',
      createdAt: 'date',
      updatedAt: 'date'
    }
  };
} 