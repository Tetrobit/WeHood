import { Realm } from '@realm/react';
import { NearbyPost } from '../hooks/useApi';

export class NearbyPostModel extends Realm.Object {
  id!: number;
  title!: string;
  description!: string;
  latitude!: number;
  longitude!: number;
  fileId!: string;
  type!: 'image' | 'video';
  views!: number;
  likes!: number;
  liked!: boolean;
  dislikes!: number;
  createdAt!: Date;
  updatedAt!: Date;
  authorId!: string;
  authorVkId!: string;
  authorAvatar!: string;
  authorEmail!: string;
  authorFirstName!: string;
  authorLastName!: string;
  authorCreatedAt!: Date;
  authorUpdatedAt!: Date;
  address?: string;

  get author() {
    return {
      id: this.authorId,
      vkId: this.authorVkId,
      avatar: this.authorAvatar,
      email: this.authorEmail,
      firstName: this.authorFirstName,
      lastName: this.authorLastName,
      createdAt: this.authorCreatedAt,
      updatedAt: this.authorUpdatedAt,
    };
  }

  static schema: Realm.ObjectSchema = {
    name: 'NearbyPost',
    primaryKey: 'id',
    properties: {
      id: 'int',
      title: 'string',
      address: 'string?',
      description: 'string',
      latitude: 'double',
      longitude: 'double',
      fileId: 'string',
      type: 'string',
      views: 'int',
      likes: 'int',
      liked: 'bool',
      createdAt: 'date',
      updatedAt: 'date',
      authorId: 'string',
      authorVkId: 'string',
      authorAvatar: 'string',
      authorEmail: 'string',
      authorFirstName: 'string',
      authorLastName: 'string',
      authorCreatedAt: 'date',
      authorUpdatedAt: 'date',
    },
  };

  static fromApi(post: NearbyPost): Partial<NearbyPostModel> {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      latitude: post.latitude,
      longitude: post.longitude,
      fileId: post.fileId,
      type: post.type,
      views: post.views,
      likes: post.likes,
      liked: post.liked,
      address: post.address,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authorId: post.author.id,
      authorVkId: post.author.vkId,
      authorAvatar: post.author.avatar,
      authorEmail: post.author.email,
      authorFirstName: post.author.firstName,
      authorLastName: post.author.lastName,
      authorCreatedAt: post.author.createdAt,
      authorUpdatedAt: post.author.updatedAt,
    };
  }

  toApi(): NearbyPost {
    return {
      id: this.id,
      title: this.title,
      address: this.address,
      description: this.description,
      latitude: this.latitude,
      longitude: this.longitude,
      fileId: this.fileId,
      type: this.type as 'image' | 'video',
      views: this.views,
      likes: this.likes,
      liked: this.liked,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: this.author,
    };
  }
}
