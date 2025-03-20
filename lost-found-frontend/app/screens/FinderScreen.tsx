import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, TextInput, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '..';
import { ThemedText } from '../../components/ThemedText';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { API_URL } from '../../constants/Config';

// List of UMD buildings
const UMD_BUILDINGS = [
  "I have it",
  "Adele H. Stamp Student Union",
  "A. James Clark Hall",
  "Animal Sciences Building",
  "Annapolis Hall",
  "Anne Arundel Hall",
  "Architecture Building",
  "Art-Sociology Building",
  "Atlantic Building",
  "Baltimore Hall",
  "Bel Air Hall",
  "Biology-Psychology Building",
  "Biomolecular Sciences Building",
  "Bioscience Research Building",
  "Brendan Iribe Center", // Added here
  "Byrd Stadium",
  "Calvert Hall",
  "Cambridge Hall",
  "Caroline Hall",
  "Carroll Hall",
  "Cecil Hall",
  "Centreville Hall",
  "Charles Hall",
  "Chemical and Nuclear Engineering Building",
  "Chemistry Building",
  "Chestertown Hall",
  "Chincoteague Hall",
  "Clarice Smith Performing Arts Center",
  "Cole Student Activities Building",
  "Computer Science Instructional Center",
  "Cumberland Hall",
  "Denton Hall",
  "Dorchester Hall",
  "Easton Hall",
  "Education Building",
  "Elkton Hall",
  "Ellicott Hall",
  "Energy Research Facility",
  "Engineering Laboratory Building",
  "Francis Scott Key Hall",
  "Frederick Hall",
  "Garrett Hall",
  "Geology Building",
  "H.J. Patterson Hall",
  "Hagerstown Hall",
  "Harford Hall",
  "Hornbake Library",
  "Howard Hall",
  "Jiménez Hall",
  "J.M. Patterson Hall",
  "Johnson-Whittle Hall",
  "Jull Hall",
  "Kent Hall",
  "Kim Engineering Building",
  "Knight Hall",
  "La Plata Hall",
  "LeFrak Hall",
  "Marie Mount Hall",
  "Mathematics Building",
  "McKeldin Library",
  "Memorial Chapel",
  "Montgomery Hall",
  "Morrill Hall",
  "Oakland Hall",
  "Physics Building",
  "Plant Sciences Building",
  "Preinkert Field House",
  "Prince Frederick Hall",
  "Prince George's Hall",
  "Pyon-Chen Hall",
  "Queen Anne's Hall",
  "Reckord Armory",
  "Ritchie Coliseum",
  "Rossborough Inn",
  "School of Public Health Building",
  "SECU Stadium",
  "Shoemaker Building",
  "Shriver Laboratory",
  "Skinner Building",
  "Somerset Hall",
  "South Campus Dining Hall",
  "St. Mary's Hall",
  "Susquehanna Hall",
  "Symons Hall",
  "Talbot Hall",
  "Taliaferro Hall",
  "Tawes Fine Arts Building",
  "Thomas V. Miller, Jr. Administration Building",
  "Thurgood Marshall Hall",
  "Turner Hall",
  "Tydings Hall",
  "Van Munching Hall",
  "Washington Hall",
  "Wicomico Hall",
  "William E. Kirwan Hall",
  "Wind Tunnel Building",
  "Woods Hall",
  "Worcester Hall",
  "Xfinity Center",
  "Yahentamitsi Dining Hall"
];

type FinderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Finder'>;

type Props = {
  navigation: FinderScreenNavigationProp;
};

const FinderScreen: React.FC<Props> = ({ navigation }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [lostLocation, setLostLocation] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // New loading state
  const inputRef = useRef<TextInput>(null);

  const filteredBuildings = lostLocation
    ? ["I have it", ...UMD_BUILDINGS.filter((b) => b !== "I have it" && b.toLowerCase().includes(lostLocation.toLowerCase()))]
    : UMD_BUILDINGS;

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
    if (permissionResult.granted === false) {
      alert("Sorry, we need photo gallery permissions to make this work!");
        return;
      }
        
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
        
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      console.log('Location:', loc.coords.latitude, loc.coords.longitude);
    }
  };

  const takePhoto = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (cameraStatus !== 'granted' || locationStatus !== 'granted') {
      alert('Sorry, we need camera and location permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      console.log('Location:', loc.coords.latitude, loc.coords.longitude);
    }
  };

  const uploadImage = async () => {
    if (!imageUri || !location) {
      alert('Please take a photo to upload.');
      return;
    }
    if (!lostLocation) {
      alert('Please select where you left the item.');
      return;
    }

    setLoading(true); // Start loading state

    const date = new Date();
    date.setHours(date.getHours()); // Adjust to EDT (UTC-4)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour, use 12 for midnight/noon
    const timestamp = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}_${period}`;

    const filename = `upload_${timestamp}_${location.latitude.toFixed(5)}_${location.longitude.toFixed(5)}.jpg`;

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: 'image/jpeg',
    } as any);

    formData.append('latitude', location.latitude.toString());
    formData.append('longitude', location.longitude.toString());
    formData.append('lostLocation', lostLocation);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
        Alert.alert('Image Uploaded', 'Thanks for helping out!');
        setImageUri(null);
        setLocation(null);
        setLostLocation('');
        setDropdownVisible(false);
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', data.error || 'Upload failed.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'An error occurred while uploading.');
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Upload Found Item</ThemedText>
      
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <ThemedText style={styles.placeholder}>Select an image</ThemedText>
        )}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <ThemedText style={styles.buttonText}>Take Photo</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        {dropdownVisible && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={filteredBuildings}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setLostLocation(item);
                    setDropdownVisible(false);
                  }}
                >
                  <ThemedText style={styles.dropdownText}>{item}</ThemedText>
                </TouchableOpacity>
              )}
              style={styles.dropdown}
              inverted
            />
          </View>
        )}
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Where did you leave it? (e.g., McKeldin Library)"
          placeholderTextColor="#888"
          value={lostLocation}
          onChangeText={(text) => {
            setLostLocation(text);
            setDropdownVisible(true);
          }}
          onFocus={() => setDropdownVisible(true)}
        />
      </View>

      <TouchableOpacity
        style={[styles.uploadButton, loading && styles.uploadButtonPressed]}
        onPress={uploadImage}
        disabled={loading} // Disable button while uploading
      >
        <ThemedText style={styles.buttonText}>
          {loading ? 'Uploading' : 'Upload Item'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#11181C' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  imagePicker: {
    width: '100%',
    height: 220,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  image: { width: '100%', height: '100%', borderRadius: 8 },
  placeholder: { color: '#888' },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonPressed: {
    backgroundColor: '#085f7c', // Darker shade when pressed/uploading
    opacity: 0.8, // Slightly faded to indicate action
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  dropdownContainer: {
    position: 'absolute',
    bottom: '110%',
    width: '100%',
    maxHeight: 310,
    backgroundColor: '#333',
    borderRadius: 8,
    zIndex: 1,
  },
  dropdown: {
    width: '100%',
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    color: '#fff',
  },
});

export default FinderScreen;