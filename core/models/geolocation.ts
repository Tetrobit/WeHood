import { Realm } from '@realm/react';

export class Geolocation extends Realm.Object<Geolocation, "latitude" | "longitude" | "timestamp"> {
  _id = new Realm.BSON.ObjectId();
  latitude!: number;
  longitude!: number;
  timestamp!: Date;

  static primaryKey = "_id";

  constructor(realm: Realm, latitude: number, longitude: number, timestamp: Date) {
    super(realm, { latitude, longitude, timestamp });
  }

  static generate(latitude: number, longitude: number, timestamp: Date) {
    return {
      _id: new Realm.BSON.ObjectId(),
      latitude,
      longitude,
      timestamp,
    }
  }

  static schema = {
    name: 'Geolocation',
    properties: {
      _id: 'objectId',
      latitude: 'double',
      longitude: 'double',
      timestamp: 'date',
    },
  };
}

export default Geolocation;