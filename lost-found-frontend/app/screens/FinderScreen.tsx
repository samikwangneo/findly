import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '..';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedText } from '../../components/ThemedText';
import { API_URL } from '../../constants/Config';
import * as Location from 'expo-location';

type FinderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Finder'>;

type Props = {
  navigation: FinderScreenNavigationProp;
};

const FinderScreen: React.FC<Props> = ({ navigation }) => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const primaryColor = '#0a7ea4'
  const backgroundColor = '#11181C'
  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("You need to allow access to your photos to upload an item");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("You need to allow access to your camera to take a photo");
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image first");
      return;
    }
    
    setLoading(true);
    
    try {
    // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert("Location permission denied. Uploading without location.");
        // Proceed without location if denied
      }
      
      let latitude = null;
      let longitude = null;
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
        console.log('Location:', latitude, longitude);
      }

      console.log('Image URI:', image);
      const formData = new FormData();

      const now = new Date();
      const formattedDate = now.toISOString()
        .replace(/T/, '_')                   
        .replace(/:|\./g, '-')              
        .slice(0, 19);           
      
      const baseFileName = `upload_${formattedDate}`;
      const fileName = latitude && longitude 
        ? `${baseFileName}_${latitude.toFixed(5)}_${longitude.toFixed(5)}.jpg` 
        : `${baseFileName}.jpg`; // Fallback if no location

      // Create the file object
      const fileObj = {
        uri: image,
        type: 'image/jpeg',
        name: fileName,
      };
      
      // @ts-ignore to bypass TypeScript checking
      formData.append('file', fileObj);
      if (latitude && longitude) {
        formData.append('latitude', latitude.toString());
        formData.append('longitude', longitude.toString());
      }
      
      console.log('Uploading to:', `${API_URL}/upload`);
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Server response:', result);
      
      alert("Item uploaded successfully!");
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.instructions}>
          Take a clear photo of the item you found. This will help the owner identify it.
        </ThemedText>
        
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.placeholderImage}>
              <ThemedText style={styles.placeholderText}>No image selected</ThemedText>
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: primaryColor }]} 
            onPress={takePhoto}
          >
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: primaryColor }]} 
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
        
        {image && (
          <TouchableOpacity 
            style={[styles.uploadButton, { backgroundColor: primaryColor, opacity: loading ? 0.7 : 1 }]}
            onPress={uploadImage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Upload Found Item</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePreview: {
    width: 300,
    height: 225,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 300,
    height: 225,
    borderRadius: 8,
    backgroundColor: '#808080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    opacity: 0.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  uploadButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FinderScreen;