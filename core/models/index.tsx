import { RealmProvider, useRealm } from '@realm/react';
import { Realm } from 'realm';
import UserModel from './UserModel';
import GeolocationModel from './GeolocationModel';
import { NearbyPostModel } from './NearbyPostModel';
import { CommentModel } from './CommentModel';
import { WeatherForecastModel } from './WeatherForecastModel';

const StorageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RealmProvider schema={[NearbyPostModel, UserModel, GeolocationModel, CommentModel, WeatherForecastModel]} deleteRealmIfMigrationNeeded={true}>
      {children}
    </RealmProvider>
  )
}

export default StorageProvider;
