import { useRouter } from "expo-router";

const App = () => {
  const router = useRouter();
  router.push('/auth');
  return null;
};

export default App;