import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, Camera, CameraMode } from 'expo-camera';
import { useVideoPlayer, VideoView } from 'expo-video';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme, Theme } from '@/core/hooks/useTheme';
import useGeolocation from '@/core/hooks/useGeolocation';
import ToastManager, { Toast } from 'toastify-react-native';
import { UploadNearbyPostRequest, useApi } from '@/core/hooks/useApi';
import LottieView from 'lottie-react-native';
import { compressImage } from '@/core/utils/image';
import AnimatedText from '@/app/components/AnimatedText';

export default function AddContentScreen() {
  const { uploadNearbyPost, uploadFile } = useApi();
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>('back');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [contentType, setContentType] = useState<'image' | 'video' | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const [theme] = useTheme();
  const { lastLocation, requestGeolocation } = useGeolocation();
  const styles = makeStyles(theme!);
  const player = useVideoPlayer(contentType === 'video' && mediaUri ? mediaUri : null);

  React.useEffect(() => {
    if (!lastLocation || lastLocation.timestamp.getTime() < Date.now() - 1000 * 60 * 5) {
      requestGeolocation();
    }
  }, [lastLocation]);

  const handleCapture = async () => {
    if (cameraRef.current && contentType === 'image') {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          shutterSound: false,
          quality: 1,
          base64: true,
        });
        setMediaUri(photo.uri);
      } catch (error) {
        console.error('Ошибка при съемке фото:', error);
      }
    }
  };

  const handleRecord = async () => {
    if (cameraRef.current && contentType === 'video') {
      if (!isRecording) {
        setIsRecording(true);
        try {
          const CameraPermissions = await Camera.requestCameraPermissionsAsync();
          const MicrophonePermissions = await Camera.requestMicrophonePermissionsAsync();

          if (!CameraPermissions.granted || !MicrophonePermissions.granted) {
            Toast.error('Разрешение на использование камеры было отклонено');
            return;
          }
          const video = await cameraRef.current.recordAsync({
            maxDuration: 30,
          });
          setMediaUri(video!.uri);
        } catch (error) {
          Toast.error('Ошибка при записи видео');
          console.error('Ошибка при записи видео:', error);
        }
        setIsRecording(false);
      } else {
        try {
          await cameraRef.current.stopRecording();
        } catch (error) {
          Toast.error('Ошибка при остановке записи видео');
          console.error('Ошибка при остановке записи видео:', error);
        }
      }
    }
  };

  React.useLayoutEffect(() => {
    if (mediaUri && contentType === 'video') {
      setTimeout(() => {
        player.play();
      }, 1000);
    }
  }, [mediaUri]);

  const handleSubmit = async () => {
    let uri = mediaUri;
    if (contentType === 'image') {
      uri = await compressImage(uri!);
    }

    try {
      const uploadFileResponse = await uploadFile(uri!, contentType!);
      const fileId = uploadFileResponse.fileId;

      if (!fileId) {
        throw new Error('Ошибка при загрузке файла');
      }

      const data: UploadNearbyPostRequest = {
        latitude: lastLocation.latitude,
        longitude: lastLocation.longitude,
        title: title,
        description: description,
        fileId: fileId,
        address: [lastLocation.locality, lastLocation.district, lastLocation.street, lastLocation.house].filter(v => v && v.length).join(', '),
        type: contentType!,
      }

      const response = await uploadNearbyPost(data);
      if (!response.id) {
        throw new Error('Ошибка при публикации контента');
      }

      Toast.success('Контент успешно опубликован');
      router.back();
    } catch (error) {
      Toast.error('Ошибка при публикации контента');
      console.error('Ошибка при публикации контента:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!permission) {
    return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><Text style={styles.message}>Загрузка разрешений...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <LottieView
          source={require('@/assets/lottie/camera-permission.json')}
          autoPlay
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.message}>Нам нужен доступ к камере</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Разрешить доступ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!contentType ? (
        <View style={styles.contentTypeContainer}>
          <Text style={styles.title}>Выберите тип контента</Text>
          <View style={styles.contentTypeButtons}>
            <TouchableOpacity 
              style={styles.contentTypeButton}
              onPress={() => setContentType('image')}
            >
              <MaterialIcons name="photo-camera" size={24} color="#fff" />
              <Text style={styles.contentTypeText}>Фотография</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.contentTypeButton}
              onPress={() => setContentType('video')}
            >
              <MaterialIcons name="videocam" size={24} color="#fff" />
              <Text style={styles.contentTypeText}>Видео</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : !mediaUri ? (
        <View style={styles.cameraContainer}>
          <CameraView 
            mode={(contentType === 'video' ? 'video' : 'photo') as CameraMode}
            style={styles.camera} 
            facing={type}
            ref={cameraRef}
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => setType(type === 'back' ? 'front' : 'back')}
              >
                <MaterialIcons name="flip-camera-ios" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={contentType === 'image' ? handleCapture : handleRecord}
              >
                <MaterialIcons 
                  name={contentType === 'image' ? 'camera' : (isRecording ? 'stop' : 'videocam')} 
                  size={30} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          {contentType === 'image' ? (
            <Image source={{ uri: mediaUri }} style={styles.preview} />
          ) : (
            <VideoView player={player} style={styles.preview}/>
          )}
          <TextInput
            style={styles.titleInput}
            placeholder="Добавьте название..."
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Добавьте описание..."
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View style={styles.locationInfo}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <AnimatedText
              style={styles.locationText}
              text={[lastLocation.locality, lastLocation.district, lastLocation.street, lastLocation.house].filter(v => v && v.length).join(', ')}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Опубликовать</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ToastManager />
    </View>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
  },
  message: {
    fontSize: 16,
    color: theme === 'dark' ? '#fff' : '#222',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  contentTypeContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#222',
    textAlign: 'center',
    marginBottom: 30,
  },
  contentTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contentTypeButton: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: '45%',
  },
  contentTypeText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 30,
  },
  flipButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
  },
  captureButton: {
    padding: 20,
    backgroundColor: '#007AFF',
    borderRadius: 40,
  },
  previewContainer: {
    flex: 1,
    padding: 20,
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  videoPreview: {
    width: '100%',
    height: 300,
    backgroundColor: '#333',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#444' : '#ddd',
    borderRadius: 10,
    padding: 15,
    color: theme === 'dark' ? '#fff' : '#222',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#444' : '#ddd',
    borderRadius: 10,
    padding: 15,
    color: theme === 'dark' ? '#fff' : '#222',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  locationText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 