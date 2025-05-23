import { API_URL } from "@/core/constants/environment";
import * as Device from 'expo-device';
import { useSharedValue } from "react-native-reanimated";
import { useQuery, useRealm } from "@realm/react";
import Profile from "../models/profile";

export interface VKParameters {
  vkAppId: string;
  redirectUri: string;
  code_challenge: string;
  code_verifier: string;
  scope: string;
}

export interface LoginWithVKResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    email: string;
    vkId: string;
  }
  device: {
    id: string;
  }
}

export const useApi = () => {
  const realm = useRealm();
  const [profile] = useQuery(Profile);
  const codeVerifier = useSharedValue<string | null>(null);

  const getVKParameters = async (): Promise<VKParameters> => {
    const response = await fetch(`${API_URL}/api/auth/vk-parameters`);
    const data = await response.json();
    codeVerifier.value = data.code_verifier;
    return data;
  }

  const generateVKAuthUrl = async (): Promise<string> => {
    const { vkAppId, redirectUri, code_challenge, scope } = await getVKParameters();
    const url = `https://id.vk.com/authorize?client_id=${vkAppId}&redirect_uri=${redirectUri}&code_challenge=${code_challenge}&code_challenge_method=S256&response_type=code&scope=${scope}`;
    return url;
  }

  const loginWithVK = async (code: string, device_id: string, state: string): Promise<LoginWithVKResponse> => {
    const response = await fetch(`${API_URL}/api/auth/login-vk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier.value!,
        device_id,
        state,
        device_name: Device.modelName,
        device_os: Device.osName,
        device_os_version: Device.osVersion,
        device_params: {
          manufacturer: Device.manufacturer,
          model: Device.modelName,
          brand: Device.brand,
          device_manufacturer: Device.manufacturer,
          device_model: Device.modelName,
        }
      }),
    });

    const data = await response.json();

    realm.write(() => {
      realm.delete(realm.objects(Profile));
    });

    realm.write(() => {
      realm.create(Profile, Profile.fromLoginWithVK(data));
    });

    return data;
  }

  return {
    getVKParameters,
    generateVKAuthUrl,
    loginWithVK,
  }
}

export default useApi;
