import { RealmProvider, useRealm } from '@realm/react';
import { Realm } from 'realm';
import Theme from './theme';
import Profile from './profile';
import Greeting from './greeting';
import Geolocation from './geolocation';

const StorageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RealmProvider schema={[Theme, Profile, Greeting, Geolocation]}>
      {children}
    </RealmProvider>
  )
}

export default StorageProvider;
