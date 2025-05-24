import { Realm } from '@realm/react';
import { LoginResponse, LoginWithVKResponse, RegisterResponse } from '@/core/hooks/useApi';

class Profile extends Realm.Object<Profile, "id" | "token" | "email" | "deviceId"> {
  _id = new Realm.BSON.ObjectId();
  id!: string;
  deviceId!: string;
  email!: string;
  token!: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  vkId?: string;

  static primaryKey = "_id";

  constructor(realm: Realm, id: string, token: string, email: string, deviceId: string, firstName?: string, lastName?: string, avatar?: string, vkId?: string) {
    super(realm, { id, token, email, deviceId, firstName, lastName, avatar, vkId });
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


  static fromRegister(data: RegisterResponse) {
    return {
      _id: new Realm.BSON.ObjectId(),
      id: data.user.id,
      token: data.token,
      email: data.user.email,
      deviceId: data.device.id,
      firstName: data.user.firstName || '',
      lastName: data.user.lastName || '',
    }
  }

  static fromLogin(data: LoginResponse) {
    return {
      _id: new Realm.BSON.ObjectId(),
      id: data.user!.id,
      token: data.token!,
      firstName: data.user!.firstName,
      lastName: data.user!.lastName,
      avatar: data.user!.avatar,
      email: data.user!.email,
      vkId: data.user!.vkId,
      deviceId: data.device!.id,
    }
  }

  static schema = {
    name: 'Profile',
    properties: {
      _id: 'objectId',
      id: 'string',
      token: 'string',
      firstName: {type: 'string', optional: true},
      lastName: {type: 'string', optional: true},
      avatar: {type: 'string', optional: true},
      email: 'string',
      vkId: {type: 'string', optional: true},
      deviceId: 'string',
    },
  };
}

export default Profile;