import { Realm } from '@realm/react';

export class Geocoder extends Realm.Object<Geocoder, "country" | "province" | "city" | "district" | "street" | "house" | "other"> {
  _id = new Realm.BSON.ObjectId();
  country?: string;
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  house?: string;
  other?: string;

  static primaryKey = "_id";

  constructor(realm: Realm, country: string, province: string, city: string, district: string, street: string, house: string, other: string) {
    super(realm, { country, province, city, district, street, house, other });
  }

  static generate(attributes: Record<string, string>) {
    return {
      _id: new Realm.BSON.ObjectId(),
      ...attributes,
    }
  }

  static schema = {
    name: 'Geocoder',
    properties: {
      _id: 'objectId',
      country: 'string?',
      province: 'string?',
      city: 'string?',
      district: 'string?',
      street: 'string?',
      house: 'string?',
      other: 'string?',
    },
  };
}

export default Geocoder;