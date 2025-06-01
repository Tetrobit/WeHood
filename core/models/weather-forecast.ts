import { Realm } from '@realm/react';

export class WeatherForecast extends Realm.Object<WeatherForecast, "response" | "timestamp"> {
  _id = new Realm.BSON.ObjectId();
  response!: string;
  timestamp!: Date;

  static primaryKey = "_id";

  constructor(realm: Realm, response: string, timestamp: Date) {
    super(realm, { response, timestamp });
  }

  static generate(response: string, timestamp: Date = new Date()) {
    return {
      _id: new Realm.BSON.ObjectId(),
      response,
      timestamp,
    }
  }

  static schema = {
    name: 'WeatherForecast',
    properties: {
      _id: 'objectId',
      timestamp: 'date',
      response: 'string',
    },
  };
}

export default WeatherForecast;