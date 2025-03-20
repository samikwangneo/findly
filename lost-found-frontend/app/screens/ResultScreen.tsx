import React from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '..';
import { ThemedText } from '../../components/ThemedText';
import { API_URL } from '../../constants/Config';

type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

type Props = {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
};

type ResultItemType = {
  id: string;
  imagePath: string;
  confidence: number;
  lostLocation?: string;
};

const ResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { searchQuery, searchResults = [] } = route.params || {};
  
  const backgroundColor = '#11181C';
  const cardColor = '#808080';
  const primaryColor = '#0a7ea4';
  
  const openMapWithCoords = (latitude: string, longitude: string) => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon)) {
      console.log('Invalid coordinates:', latitude, longitude);
      return;
    }
    const url = Platform.OS === 'ios'
      ? `maps://app?saddr=&daddr=${lat},${lon}`
      : `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else alert("Unable to open maps");
    }).catch((err) => console.error('Error opening URL:', err));
  };

  const openBuildingLink = (building: string) => {
    if (!building || building === 'Unknown' || building === 'I have it') {
      console.log('No valid building link provided');
      return;
    }
    const encodedQuery = encodeURIComponent(`${building}, University of Maryland, College Park`);
    const url = Platform.OS === 'ios'
      ? `maps://app?q=${encodedQuery}`
      : `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else alert("Unable to open maps");
    }).catch((err) => console.error('Error opening URL:', err));
  };
  
  const renderItem = ({ item }: { item: ResultItemType }) => {
    console.log('Rendering image URL:', item.imagePath);
    const confidencePercent = Math.round(item.confidence * 100);
    const split_file_name = item.imagePath.split("/");
    const fileName = split_file_name[4]; // e.g., "upload_2025_03_20_8_32_20_PM_41.18371_-73.46578__McKeldin_Library.jpg"
    const parts = fileName.split('_');
    const date_file_name = `${parts[1]}-${parts[2]}-${parts[3]}, at ${parts[4]}:${parts[5]}:${parts[6]} ${parts[7]}`; // "2025-03-20, at 8:32:20 PM"
    const latitude = parts[8]; // "41.18371"
    const longitude = parts[9].split('__')[0]; // "-73.46578"
    const location_name = `${latitude}, ${longitude}`;
    const lostLocation = item.lostLocation || 'Unknown';
    console.log({lostLocation})
        
    return (
      <View style={[styles.resultCard, { backgroundColor: cardColor }]}>
        <Image 
          source={{ uri: item.imagePath }} 
          style={styles.resultImage}
          defaultSource={require('../../assets/images/placeholder.png')}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          key={item.imagePath}
        />
        
        <View style={styles.resultDetails}>
          <ThemedText style={styles.filenameText}>
            Date Found: {date_file_name}
          </ThemedText>
          <TouchableOpacity onPress={() => openMapWithCoords(latitude, longitude)}>
            <ThemedText style={styles.locationText}>
              Location Found: <ThemedText style={styles.locationLink}>{location_name}</ThemedText>
            </ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.confidenceText}>
            Match Confidence: <ThemedText style={styles.confidenceValue}>{confidencePercent}%</ThemedText>
          </ThemedText>
          {lostLocation === 'I have it' ? (
            <ThemedText style={styles.lostLocationText}>
              Current Location: {lostLocation}
            </ThemedText>
          ) : (
            <TouchableOpacity onPress={() => openBuildingLink(lostLocation)}>
              <ThemedText style={styles.lostLocationText}>
                Current Location: <ThemedText style={styles.locationLink}>{lostLocation}</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.queryContainer}>
        <ThemedText style={styles.queryLabel}>Your search:</ThemedText>
        <ThemedText style={styles.queryText}>{searchQuery}</ThemedText>
      </View>
      
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <ThemedText style={styles.noResultsText}>
            No matching items found. We'll notify you if someone uploads a matching item.
          </ThemedText>
          <TouchableOpacity 
            style={[styles.homeButton, { backgroundColor: primaryColor }]}
            onPress={() => navigation.navigate('Home')}
          >
            <ThemedText style={styles.buttonText}>Back to Home</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  queryContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  queryLabel: { fontSize: 14, marginBottom: 4, opacity: 0.7 },
  queryText: { fontSize: 16, fontWeight: 'bold' },
  resultsList: { padding: 16 },
  resultCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultImage: { width: '100%', height: 300, resizeMode: 'cover' },
  resultDetails: { padding: 16 },
  filenameText: { fontSize: 14, marginBottom: 8, color: '#fff' },
  locationText: { fontSize: 14, marginBottom: 8, color: '#fff' },
  lostLocationText: { fontSize: 14, marginBottom: 8, color: '#fff' },
  locationLink: { color: '#ADD8E6', textDecorationLine: 'underline' },
  confidenceText: { fontSize: 16, marginBottom: 8, color: '#fff' },
  confidenceValue: { fontWeight: 'bold' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  noResultsContainer: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  noResultsText: { fontSize: 16, textAlign: 'center', marginBottom: 24 },
  homeButton: { padding: 12, borderRadius: 8, alignItems: 'center', width: 200, backgroundColor: '#0a7ea4' },
});

export default ResultScreen;