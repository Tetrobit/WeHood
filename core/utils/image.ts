import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';


export const compressImage = async (uri: string): Promise<string> => {
  const imageSource = await ImageManipulator.manipulate(uri);
  const imageRef = await imageSource.renderAsync();
  const imageResult = await imageRef.saveAsync({ compress: 0.15, format: SaveFormat.JPEG });
  const imageUri = imageResult.uri;
  return imageUri;
};
