import { RealmProvider } from '@realm/react';
import Theme from './theme';
import Profile from './profile';
import Greeting from './greeting';

const StorageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RealmProvider schema={[Theme, Profile, Greeting]}>
      {children}
    </RealmProvider>
  )
}

export default StorageProvider;
