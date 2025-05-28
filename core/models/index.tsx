import { RealmProvider } from '@realm/react';
import Theme from './theme';
import Profile from './profile';
import Greeting from './greeting';
import Geolocation from './geolocation';
import Geocoder from './geocoder';

const StorageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RealmProvider schema={[Theme, Profile, Greeting, Geolocation, Geocoder]}>
      {children}
    </RealmProvider>
  )
}

export default StorageProvider;
