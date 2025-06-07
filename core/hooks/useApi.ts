import { API_URL, MEDIA_URL } from "@/core/constants/environment";
import * as Device from 'expo-device';
import { useSharedValue } from "react-native-reanimated";
import { useQuery, useRealm } from "@realm/react";
import UserModel from "../models/UserModel";
import { NearbyPostModel } from "../models/NearbyPostModel";
import Realm from "realm";
import { CommentModel } from "../models/CommentModel";
import * as SecureStorage from 'expo-secure-store';
import axios, { AxiosRequestConfig } from "axios";
import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

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
  deleted?: boolean;
}

export interface SummarizeCommentsResponse {
  ok: boolean;
  summary?: string;
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
    vkId?: string;
    avatar?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
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

export interface GenerateAvatarResponse {
  id: string;
  avatar: string;
}

export interface WeatherAIRecommendationResponse {
  ok: boolean;
  recommendation: string;
}

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'event' | 'help' | 'chat' | 'system' | 'nearby_like';
  isRead: boolean;
  postId?: string;
  userId?: string;
  data?: Record<string, any>;
};

export interface Voting {
  id: string;
  title: string;
  description: string;
  image: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  totalVotes: number;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  createdAt: string;
}

export interface VotingById extends Voting {
  userVoted: boolean;
  userVotedOption: number;
}

export interface GetVotingsResponse {
  votings: Voting[];
  total: number;
}

export interface VoteResponse extends VotingById {}

export interface CreateVotingRequest {
  title: string;
  description: string;
  image: string;
  options: Array<string>
}

export interface CreateVotingResponse extends Voting {}

export const useApi = () => {
  const realm = useRealm();
  const codeVerifier = useSharedValue<string | null>(null);

  const getFCMToken = async (): Promise<string | null> => {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  };

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
    const fcmToken = await getFCMToken();

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
        },
        fcm_token: fcmToken
      }),
    });

    const data = await response.json();

    SecureStorage.setItem('token', data.token);
    SecureStorage.setItem('user_id', data.user.id);
    SecureStorage.setItem('device_id', data.device.id);

    return data;
  }

  const withAuth = async <T>(url: string, options: AxiosRequestConfig = {}): Promise<T> => {
    const response = await axios.request({
      url,
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${SecureStorage.getItem('token')}`,
      },
    });
    return response.data;
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
    const fcmToken = await getFCMToken();
    
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
        },
        fcm_token: fcmToken
      }),
    });

    const data = await response.json();

    SecureStorage.setItem('token', data.token);
    SecureStorage.setItem('user_id', data.user.id);
    SecureStorage.setItem('device_id', data.device.id);

    return data;
  }

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const fcmToken = await getFCMToken();
    
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
        },
        fcm_token: fcmToken
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
      data: {
        oldPassword,
        newPassword,
      },
    });
  };

  const getUserById = async (id: string): Promise<UserModel> => {
    const response = await withAuth<UserModel>(`${API_URL}/api/auth/profile/${id}`);

    try {
      realm.write(() => {
        realm.create(UserModel, {
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          avatar: response.avatar,
          email: response.email,
          vkId: response.vkId,
        }, Realm.UpdateMode.Modified);
      });
    } catch(error) {
      console.error('Не удалось сохранить пользователя в Realm', error);
    }
    return response;
  }

  const generateAvatar = async (prompt?: string): Promise<GenerateAvatarResponse> => {
    const response = await withAuth<GenerateAvatarResponse>(`${API_URL}/api/auth/generate-avatar?prompt=${prompt}`, {
      method: 'POST',
      timeout: 60000,
      timeoutErrorMessage: 'Время ожидания истекло',
    });

    try {
      realm.write(() => {
        realm.create(UserModel, {
          id: response.id,
          avatar: response.avatar,
        } as UserModel, Realm.UpdateMode.Modified);
      });
    } catch(error) {
      console.error('Не удалось сохранить аватар в Realm', error);
    }

    return response;
  }

  const updateProfile = async (data: { firstName?: string, lastName?: string, avatar?: string }): Promise<UserUpdateResponse> => {
    const response = await withAuth<UserUpdateResponse>(`${API_URL}/api/auth/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
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
      data: data,
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
      data: { text },
      validateStatus: (status) => status < 500,
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

  const summarizeComments = async (postId: number): Promise<SummarizeCommentsResponse> => {
    return await withAuth<SummarizeCommentsResponse>(`${API_URL}/api/nearby/posts/${postId}/comments/summarize`);
  };

  const getWeatherAIRecommendation = async (weatherData: WeatherForecastResponse): Promise<WeatherAIRecommendationResponse> => {
    return await withAuth<WeatherAIRecommendationResponse>(`${API_URL}/api/weather/ai-recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: weatherData,
    });
  };

  const fetchNotifications = useCallback(async (offset: number = 0, limit: number = 10): Promise<Notification[]> => {
    try {
      const response = await withAuth<Notification[]>(`${API_URL}/api/notifications?offset=${offset}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }, []);

  const markNotificationAsRead = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/read-all`, {
        method: 'PUT',
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  }, []);

  const getVotings = async (offset: number = 0, limit: number = 10, userId: string | undefined = undefined): Promise<GetVotingsResponse> => {
    return withAuth<GetVotingsResponse>(`${API_URL}/api/polls?offset=${offset}&limit=${limit}${userId ? `&userId=${userId}` : ''}`);
  };

  const getVotingById = async (id: string): Promise<VotingById> => {
    return withAuth<VotingById>(`${API_URL}/api/polls/${id}`);
  };

  const vote = async (votingId: string, optionId: number): Promise<VoteResponse> => {
    return withAuth<VoteResponse>(`${API_URL}/api/polls/vote`, {
      method: 'POST',
      data: { optionIndex: optionId, pollId: votingId }
    });
  };

  const createVoting = async (data: CreateVotingRequest): Promise<CreateVotingResponse> => {
    return withAuth<CreateVotingResponse>(`${API_URL}/api/polls`, {
      method: 'POST',
      data
    });
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
    generateAvatar,
    summarizeComments,
    getWeatherAIRecommendation,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getVotings,
    getVotingById,
    vote,
    createVoting,
  }
}

export default useApi;
