import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@rneui/themed';
import { VisionService } from '../services/VisionService';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const visionService = new VisionService();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const uploadImage = async (uri: string, name: string) => {
    try {
      const formData = new FormData();
      console.log('Uploading image:', uri);
  
      formData.append('ucardImage', {
        uri,
        name: 'ucard.jpg',
        type: 'image/jpeg',
      } as unknown as Blob); // Type assertion to Blob to satisfy TypeScript
  
      formData.append('name', name);
  
      // Use your local network IP address to reach the server
      const serverUrl = 'http://172.31.246.97:3000/upload';
  
      const responseUpload = await fetch(serverUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!responseUpload.ok) {
        throw new Error(`Failed to upload image, status: ${responseUpload.status}`);
      }
  
      const responseData = await responseUpload.text();
      console.log('Upload Response:', responseData);
    } catch (error) {
      
    }
  };  
  

  const takePicture = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({ quality: 1 });
  
      if (!result.canceled) {
        const { uri } = result.assets[0];
        if (!uri.startsWith('file://')) {
          Alert.alert('Error', 'Invalid image path. Please try again.');
          setLoading(false);
          return;
        }
  
        const detectedName = await visionService.detectText(uri);
        if (detectedName) {
          // Call the uploadImage function with the detected name and image URI
          await uploadImage(uri, detectedName);
          router.push({ pathname: '/name-confirmation', params: { name: detectedName, imageUri: uri } });
        } else {
          Alert.alert('No Name Detected', 'Please try again.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#881c1c" />
      ) : (
        <Button title="Take Photo" onPress={takePicture} containerStyle={styles.button} buttonStyle={styles.buttonStyle} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background color
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    width: '80%',
    marginTop: 20,
  },
  buttonStyle: {
    backgroundColor: '#CC0000', // Maroon button color
  },
});