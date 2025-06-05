import { Realm } from '@realm/react';
import { LoginResponse, LoginWithVKResponse, RegisterResponse } from '@/core/hooks/useApi';

class UserModel extends Realm.Object<UserModel, "id" | "firstName" | "lastName"> {
  id!: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  vkId?: string;

  static primaryKey = "id";

  constructor(realm: Realm, id: string, firstName?: string, lastName?: string, avatar?: string, vkId?: string) {
    super(realm, { id, firstName, lastName, avatar, vkId });
  }

  static fromLoginWithVK(data: LoginWithVKResponse) {
    return {
      id: data.user.id,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      avatar: data.user.avatar,
      email: data.user.email,
      vkId: data.user.vkId,
    }
  }


  static fromRegister(data: RegisterResponse) {
    return {
      id: data.user.id,
      email: data.user.email,
      firstName: data.user.firstName || '',
      lastName: data.user.lastName || '',
    }
  }

  static fromLogin(data: LoginResponse) {
    return {
      id: data.user!.id,
      firstName: data.user!.firstName,
      lastName: data.user!.lastName,
      avatar: data.user!.avatar,
      email: data.user!.email,
      vkId: data.user!.vkId,
    }
  }

  static schema = {
    name: 'User',
    primaryKey: 'id',
    properties: {
      id: 'string',
      firstName: 'string?',
      lastName: 'string?',
      avatar: 'string?',
      email: 'string?',
      vkId: 'string?',
    },
  };
}

export default UserModel;
