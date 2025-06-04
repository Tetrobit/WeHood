import { RealmProvider, useRealm } from '@realm/react';
import { Realm } from 'realm';
import User from './user';
import Geolocation from './geolocation';
import { NearbyPostModel } from './nearby-post';
import { CommentModel } from './comment';
import { WeatherForecast } from './weather-forecast';

const StorageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RealmProvider schema={[NearbyPostModel, User, Geolocation, CommentModel, WeatherForecast]} deleteRealmIfMigrationNeeded={true}>
      {children}
    </RealmProvider>
  )
}

export default StorageProvider;
