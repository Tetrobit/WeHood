import { Realm } from '@realm/react';

export class CommentModel extends Realm.Object {
  id!: number;
  text!: string;
  authorId!: number;
  postId!: number;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: 'Comment',
    primaryKey: 'id',
    properties: {
      id: 'int',
      text: 'string',
      authorId: 'int',
      postId: 'int',
      createdAt: 'date',
      updatedAt: 'date'
    }
  };
} 