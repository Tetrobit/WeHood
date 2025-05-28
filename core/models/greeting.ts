import { Realm } from '@realm/react';

class Greeting extends Realm.Object<Greeting, "isCompleted"> {
  _id = new Realm.BSON.ObjectId();
  isCompleted!: boolean;

  static primaryKey = "_id";

  constructor(realm: Realm, isCompleted: boolean) {
    super(realm, { isCompleted });
  }

  static generate(isCompleted: boolean) {
    return {
      _id: new Realm.BSON.ObjectId(),
      isCompleted,
    }
  }

  static schema = {
    name: 'Greeting',
    properties: {
      _id: 'objectId',
      isCompleted: 'bool',
    },
  };
}

export default Greeting;