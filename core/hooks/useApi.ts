import { API_URL, MEDIA_URL } from "@/core/constants/environment";
import * as Device from 'expo-device';
import { useSharedValue } from "react-native-reanimated";
import { useQuery, useRealm } from "@realm/react";
import UserModel from "../models/UserModel";
import { NearbyPostModel } from "../models/NearbyPostModel";
import Realm from "realm";
import { CommentModel } from "../models/CommentModel";
import * as SecureStorage from 'expo-secure-store';

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

export interface WeatherForecast {
  dt: number;
  main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
  };
  weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
  }>;
  clouds: {
      all: number;
  };
  wind: {
      speed: number;
      deg: number;
      gust: number;
  };
  visibility: number;
  pop: number;
  dt_txt: string;
}

export interface WeatherForecastResponse {
  error?: string;
  cod: string;
  message: number;
  cnt: number;
  list: WeatherForecast[];
  city: {
      id: number;
      name: string;
      coord: {
          lat: number;
          lon: number;
      };
      country: string;
      population: number;
      timezone: number;
      sunrise: number;
      sunset: number;
  };
}

export interface UploadNearbyPostRequest {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  fileId: string;
  type: 'image' | 'video';
  address?: string;
}

export interface CommentResponse {
  ok?: boolean;
  reason?: string;
  toxicity_score?: number;
  author: {
    avatar: string;
    createdAt: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    password: string | null;
    updatedAt: string;
    vkId: string;
  },
  createdAt: string;
  id: number;
  post: {
    createdAt: string;
    description: string;
    fileId: string;
    id: number;
    latitude: string;
    likes: number;
    location: {
      coordinates: string[];
      type: string;
    };
    longitude: string;
    title: string;
    type: string;
    updatedAt: string;
    views: number;
  },
  text: string;
  updatedAt: string;
}

export interface NearbyPost {
  title: string;
  description: string;
  latitude: number|string;
  longitude: number|string;
  fileId: string;
  address?: string;
  author: {
    id: string;
    vkId: string;
    avatar?: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
  },
  type: 'image' | 'video';
  id: number;
  views: number;
  likes: number;
  liked: boolean;
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
  deleted?: boolean;
}

export interface UploadNearbyPostResponse extends NearbyPost {};

export interface UploadFileResponse {
  fileId: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface UserUpdateResponse {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  vkId: string;
}

export const useApi = () => {
  const realm = useRealm();
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

    SecureStorage.setItem('token', data.token);
    SecureStorage.setItem('user_id', data.user.id);
    SecureStorage.setItem('device_id', data.device.id);

    return data;
  }

  const withAuth = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${SecureStorage.getItem('token')}`,
      },
    });
    return response.json();
  }

  const logout = async () => {
    await SecureStorage.deleteItemAsync('token');
    await SecureStorage.deleteItemAsync('user_id');
    await SecureStorage.deleteItemAsync('device_id');
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

    SecureStorage.setItem('token', data.token);
    SecureStorage.setItem('user_id', data.user.id);
    SecureStorage.setItem('device_id', data.device.id);

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

    SecureStorage.setItem('token', data.token);
    SecureStorage.setItem('user_id', data.user.id);
    SecureStorage.setItem('device_id', data.device.id);

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

  const getWeatherForecast = async (latitude: number, longitude: number): Promise<WeatherForecastResponse> => {
    const response = await fetch(`${API_URL}/api/weather/forecast?latitude=${latitude}&longitude=${longitude}`);
    return response.json();
  }

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ ok: boolean; message?: string }> => {
    return withAuth<{ ok: boolean; message?: string }>(`${API_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });
  };

  const getUserById = async (id: string): Promise<UserModel> => {
    const response = await withAuth<UserModel>(`${API_URL}/api/auth/user/${id}`);
    try {
      realm.write(() => {
        realm.create(UserModel, response, Realm.UpdateMode.Modified);
      });
    } catch(error) {
      console.error('Не удалось сохранить пользователя в Realm', error);
    }
    return response;
  }

  const updateProfile = async (data: { firstName?: string, lastName?: string, avatar?: string }): Promise<UserUpdateResponse> => {
    const response = await withAuth<UserUpdateResponse>(`${API_URL}/api/auth/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    realm.write(() => {
      realm.create(UserModel, {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        avatar: response.avatar,
        email: response.email,
        vkId: response.vkId,
      } as UserModel, Realm.UpdateMode.Modified);
    });

    return response;
  }

  const uploadFile = async (uri: string, mimeType: string | null): Promise<UploadFileResponse> => {
    const formData = new FormData();
    if (!mimeType) {
      const fileType = uri.split('.').pop();
      if (fileType === 'jpg' || fileType === 'jpeg') {
        mimeType = 'image/jpeg';
      } else if (fileType === 'png') {
        mimeType = 'image/png';
      } else if (fileType === 'mp4') {
        mimeType = 'video/mp4';
      }
    }

    const blob = await fetch(uri).then(res => res.blob());
    
    formData.append('file', {
      uri: uri,
      name: uri.split('/').pop(),
      type: blob.type,
    } as any);

    console.log(`Upload file: ${(blob.size / 1024 / 1024).toPrecision(2)} MB`);
    const response = await fetch(`${MEDIA_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response.json();
  }

  const uploadNearbyPost = async (data: UploadNearbyPostRequest): Promise<UploadNearbyPostResponse> => {
    return await withAuth<UploadNearbyPostResponse>(`${API_URL}/api/nearby/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  const getNearbyPosts = async (latitude: number, longitude: number): Promise<NearbyPost[]> => {
    const posts = await withAuth<NearbyPost[]>(`${API_URL}/api/nearby/posts?latitude=${latitude}&longitude=${longitude}&radius=100000`);

    // Сохраняем посты в Realm
    realm.write(() => {
      posts.forEach(post => {
        const postData = {
          ...post,
          latitude: Number(post.latitude),
          longitude: Number(post.longitude),
          views: Math.round(Number(post.views)),
          likes: Math.round(Number(post.likes)),
          liked: post.liked,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          author: {
            ...post.author,
            createdAt: new Date(post.author.createdAt),
            updatedAt: new Date(post.author.updatedAt),
          }
        };
        realm.create(NearbyPostModel, NearbyPostModel.fromApi(postData), Realm.UpdateMode.Modified);
      });
    });

    return posts;
  }

  const likePost = async (postId: number): Promise<{ views: number, liked: boolean, likes: number }> => {
    const response = await withAuth<NearbyPost>(`${API_URL}/api/nearby/posts/${postId}/like`, {
      method: 'POST',
    });
    realm.write(() => {
      const post = realm.objectForPrimaryKey(NearbyPostModel, postId);
      if (post) {
        post.liked = response.liked;
        post.likes = response.likes;
        realm.create(NearbyPostModel, post, Realm.UpdateMode.Modified);
      }
    });
    return response;
  };

  const incerementViews = async (postId: number): Promise<{ views: number, liked: boolean, likes: number }> => {
    const response = await withAuth<NearbyPost>(`${API_URL}/api/nearby/posts/${postId}/view`, {
      method: 'POST',
    });
    realm.write(() => {
      const post = realm.objectForPrimaryKey(NearbyPostModel, postId);
      if (post) {
        post.views = response.views;
        post.liked = response.liked;
        post.likes = response.likes;
        realm.create(NearbyPostModel, post, Realm.UpdateMode.Modified);
      }
    });
    return response;
  };

  const addComment = async (postId: number, text: string): Promise<CommentResponse> => {
    const comment = await withAuth<CommentResponse>(`${API_URL}/api/nearby/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (comment.ok) {
        realm.write(() => {
          realm.create(CommentModel, CommentModel.fromApi(comment), Realm.UpdateMode.Modified);
        });
    }

    return comment;
  };

  const getComments = async (postId: number): Promise<CommentResponse[]> => {
    const comments = await withAuth<CommentResponse[]>(`${API_URL}/api/nearby/posts/${postId}/comments`);

    realm.write(() => {
      comments.forEach(comment => {
        realm.create(CommentModel, CommentModel.fromApi({
          ...comment,
          post: {
            id: postId,
          }
        } as CommentResponse), Realm.UpdateMode.Modified);
      });
    });
    return comments;
  };

  const deletePost = async (postId: number): Promise<NearbyPost> => {
    const post = await withAuth<NearbyPost>(`${API_URL}/api/nearby/posts/${postId}`, {
      method: 'DELETE',
    });
    realm.write(() => {
      realm.create(NearbyPostModel, NearbyPostModel.fromApi(post), Realm.UpdateMode.Modified);
    });
    return post;
  };

  const deleteComment = async (commentId: number): Promise<CommentResponse> => {
    const comment = await withAuth<CommentResponse>(`${API_URL}/api/nearby/comments/${commentId}`, {
      method: 'DELETE',
    });
    realm.write(() => {
      realm.create(CommentModel, CommentModel.fromApi(comment), Realm.UpdateMode.Modified);
    });
    return comment;
  };

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
    getWeatherForecast,
    changePassword,
    uploadNearbyPost,
    uploadFile,
    getNearbyPosts,
    likePost,
    incerementViews,
    addComment,
    getComments,
    deletePost,
    deleteComment,
    updateProfile,
    getUserById,
  }
}

export default useApi;
