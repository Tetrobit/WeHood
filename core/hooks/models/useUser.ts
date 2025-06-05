import { useQuery, useRealm } from "@realm/react";
import UserModel from "../../models/UserModel";
import useApi from "../useApi";
import { useEffect } from "react";

export const useUser = (id: string) => {
  const api = useApi();
  const realm = useRealm();
  const [user] = useQuery(UserModel).filtered(`id = "${id}"`);

  useEffect(() => {
    if (!user) {
      api.getUserById(id);
    }
  }, [user]);

  return user;
}
