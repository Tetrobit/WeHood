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

export interface CheckEmailExistsResponse {
  exists: boolean;
  hasPassword: boolean;
}

export interface SendVerificationCodeResponse {
  id: string;
}

export interface VerifyVerificationCodeResponse {
  ok: boolean;
  message: string;
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    vkId?: string;
  },
  device: {
    id: string;
  }
}

export interface LoginResponse {
  ok: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    vkId?: string;
  },
  device?: {
    id: string;
  }
}

export interface ReverseGeocodeResponse {
  original_response: any;
  attributes: {
    country?: string;
    province?: string;
    locality?: string;
    district?: string;
    street?: string;
    house?: string;
    other?: string;
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

  const withAuth = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${profile?.token}`,
      },
    });
    return response.json();
  }

  const logout = async () => {
    realm.write(() => {
      realm.delete(realm.objects(Profile));
    })
  }

  const checkEmailExists = async (email: string): Promise<CheckEmailExistsResponse> => {
    const response = await fetch(`${API_URL}/api/auth/check-email-exists?email=${email}`);
    return response.json();
  }

  const sendVerificationCode = async (email: string): Promise<SendVerificationCodeResponse> => {
    const response = await fetch(`${API_URL}/api/auth/send-verification-code?email=${email}`);
    return response.json();
  }

  const verifyVerificationCode = async (verificationCodeId: string, email: string, code: string): Promise<VerifyVerificationCodeResponse> => {
    const response = await fetch(`${API_URL}/api/auth/verify-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        verificationCodeId,
        email,
        code,
      }),
    });
    return response.json();
  }

  const register = async (email: string, password: string, verificationCodeId: string, firstName: string, lastName: string): Promise<RegisterResponse> => { 
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        verificationCodeId,
        firstName,
        lastName,
        device_name: Device.modelName,
        device_os: Device.osName,
        device_os_version: Device.osVersion,
        device_params: {
          manufacturer: Device.manufacturer,
          model: Device.modelName,
        }
      }),
    });

    const data = await response.json();

    realm.write(() => {
      realm.delete(realm.objects(Profile));
    });

    realm.write(() => {
      realm.create(Profile, Profile.fromRegister(data));
    });

    return data;
  }

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        device_name: Device.modelName,
        device_os: Device.osName,
        device_os_version: Device.osVersion,
        device_params: {
          manufacturer: Device.manufacturer,
          model: Device.modelName,
        }
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return data;
    }

    realm.write(() => {
      realm.delete(realm.objects(Profile));
    });

    realm.write(() => {
      realm.create(Profile, Profile.fromLogin(data));
    });

    return data;
  }

  const forwardGeocode = async (address: string): Promise<string> => {
    const response = await fetch(`${API_URL}/api/geocoding/forward?address=${address}`);
    return response.json();
  }

  const reverseGeocode = async (latitude: number, longitude: number): Promise<ReverseGeocodeResponse> => {
    const response = await fetch(`${API_URL}/api/geocoding/reverse?latitude=${latitude}&longitude=${longitude}`);
    return response.json();
  }

  const ipGeocode = async (): Promise<string> => {
    const response = await fetch(`${API_URL}/api/geocoding/ip`);
    return response.json();
  }

  return {
    sendVerificationCode,
    verifyVerificationCode,
    checkEmailExists,
    generateVKAuthUrl,
    loginWithVK,
    register,
    login,
    logout,
    forwardGeocode,
    reverseGeocode,
    ipGeocode,
  }
}

export default useApi;
