import { Realm } from '@realm/react';

class Theme extends Realm.Object<Theme, "name"> {
  _id = new Realm.BSON.ObjectId();
  name!: string;

  static primaryKey = "_id";

  constructor(realm: Realm, name: string) {
    super(realm, { name });
  }

  static generate(name: string) {
    return {
      _id: new Realm.BSON.ObjectId(),
      name,
    }
  }

  static schema = {
    name: 'Theme',
    properties: {
      _id: 'objectId',
      name: 'string',
    },
  };
}

export default Theme;