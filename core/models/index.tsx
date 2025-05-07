import { RealmProvider } from '@realm/react';
import Theme from './theme';

const StorageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RealmProvider schema={[Theme]}>
      {children}
    </RealmProvider>
  )
}

export default StorageProvider;
