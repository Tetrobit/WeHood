import { Realm } from '@realm/react';

export class GeolocationModel extends Realm.Object<GeolocationModel, "latitude" | "longitude" | "timestamp" | "geocoded"> {
  _id = new Realm.BSON.ObjectId();
  latitude!: number;
  longitude!: number;
  timestamp!: Date;
  geocoded!: boolean;

  country?: string;
  province?: string;
  locality?: string;
  district?: string;
  street?: string;
  house?: string;
  other?: string;

  static primaryKey = "_id";

    constructor(realm: Realm, latitude: number, longitude: number, timestamp: Date, country?: string, province?: string, locality?: string, district?: string, street?: string, house?: string, other?: string) {
    super(realm, { latitude, longitude, timestamp, country, province, locality, district, street, house, other, geocoded: false });
  }

  static generate(latitude: number, longitude: number, timestamp: Date, attributes: Record<string, string>) {
    return {
      _id: new Realm.BSON.ObjectId(),
      latitude,
      longitude,
      timestamp,
      geocoded: false,
      country: attributes.country,
      province: attributes.province,
      locality: attributes.locality,
      district: attributes.district,
      street: attributes.street,
      house: attributes.house,
      other: attributes.other,
    }
  }

  static schema = {
    name: 'Geolocation',
    properties: {
      _id: 'objectId',
      latitude: 'double',
      longitude: 'double',
      timestamp: 'date',
      geocoded: 'bool',
      country: 'string?',
      province: 'string?',
      locality: 'string?',
      district: 'string?',
      street: 'string?',
      house: 'string?',
      other: 'string?',
    },
  };
}

export default GeolocationModel;