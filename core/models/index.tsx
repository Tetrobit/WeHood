import { RealmProvider } from '@realm/react';
import Theme from './theme';
import Profile from './profile';

const StorageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RealmProvider schema={[Theme, Profile]}>
      {children}
    </RealmProvider>
  )
}

export default StorageProvider;
