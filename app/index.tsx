import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function IndexPage() {
  const router = useRouter();

  React.useLayoutEffect(() => {
    setTimeout(() => {
      router.replace('/auth');
    }, 1000);
  }, []);

  return (
    <View>
      <Text>Hello World</Text>
    </View>
  )
}
