import { Realm } from '@realm/react';
import { LoginWithVKResponse } from '@/core/hooks/useApi';

class Profile extends Realm.Object<Profile, "token" | "firstName" | "lastName" | "avatar" | "email"> {
  _id = new Realm.BSON.ObjectId();
  id!: string;
  token!: string;
  firstName!: string;
  lastName!: string;
  avatar!: string;
  email!: string;
  vkId!: string;
  deviceId!: string;

  static primaryKey = "_id";

  constructor(realm: Realm, token: string, firstName: string, lastName: string, avatar: string, email: string) {
    super(realm, { token, firstName, lastName, avatar, email });
  }

  static fromLoginWithVK(data: LoginWithVKResponse) {
    return {
      _id: new Realm.BSON.ObjectId(),
      id: data.user.id,
      token: data.token,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      avatar: data.user.avatar,
      email: data.user.email,
      vkId: data.user.vkId,
      deviceId: data.device.id,
    }
  }

  static schema = {
    name: 'Profile',
    properties: {
      _id: 'objectId',
      id: 'string',
      token: 'string',
      firstName: 'string',
      lastName: 'string',
      avatar: 'string',
      email: 'string',
      vkId: 'string',
      deviceId: 'string',
    },
  };
}

export default Profile;