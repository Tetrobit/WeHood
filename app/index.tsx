import { useQuery } from "@realm/react";
import Theme from "@/core/models/theme";
import { useRealm } from "@realm/react";
import { Redirect } from "expo-router";
import React from "react";

export default function App() {
  const [theme] = useQuery(Theme);
  const realm = useRealm();

  if (!theme) {
    realm.write(() => {
      realm.create(Theme, Theme.generate('dark'));
    });
    return null;
  }

  return <Redirect href={'/auth'} />
}
