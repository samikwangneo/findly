import React from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
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
};

const ResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { searchQuery, searchResults = [] } = route.params || {};
  
  const backgroundColor = '#11181C';
  const cardColor = '#808080';
  const primaryColor = '#0a7ea4';
  
  const contactFinder = (item: ResultItemType) => {
    alert(`Contact feature would connect you with the finder of item ${item.id}`);
  };
  
  const renderItem = ({ item }: { item: ResultItemType }) => {
    console.log('Rendering image URL:', item.imagePath); // Debug log
    const confidencePercent = Math.round(item.confidence * 100);
    const split_file_name = item.imagePath.split("/");
    const date_file_name_split = split_file_name[4].substring(7,26).split("_");
    const date_file_name = date_file_name_split[0] + ", at " + date_file_name_split[1].substring(0,2) + 
    ":" + date_file_name_split[1].substring(3,5) + ":" + date_file_name_split[1].substring(6,8);
    const filename = date_file_name;
    const location_coords = split_file_name[4].substring(27, 45).split("_") || 'Unknown';
    const location_name = location_coords[0] + ", " + location_coords[1] || 'Unknown';
    
    return (
      <View style={[styles.resultCard, { backgroundColor: cardColor }]}>
        <Image 
          source={{ uri: item.imagePath }} 
          style={styles.resultImage}
          defaultSource={require('../../assets/images/placeholder.png')}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          key={item.imagePath} // Ensure re-render
        />
        
        <View style={styles.resultDetails}>
          <ThemedText style={styles.filenameText}>
            Date Found: {filename}
          </ThemedText>
          <ThemedText style={styles.filenameText}>
            Location Found: {location_name}
          </ThemedText>
          <ThemedText style={styles.confidenceText}>
            Match Confidence: <ThemedText style={styles.confidenceValue}>{confidencePercent}%</ThemedText>
          </ThemedText>
          
          <TouchableOpacity 
            style={[styles.contactButton, { backgroundColor: primaryColor }]}
            onPress={() => contactFinder(item)}
          >
            <ThemedText style={styles.buttonText}>Contact Finder</ThemedText>
          </TouchableOpacity>
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
  container: {
    flex: 1,
  },
  queryContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  queryLabel: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
  },
  queryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsList: {
    padding: 16,
  },
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
  resultImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  resultDetails: {
    padding: 16,
  },
  filenameText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#fff',
  },
  confidenceText: {
    fontSize: 16,
    marginBottom: 16,
  },
  confidenceValue: {
    fontWeight: 'bold',
  },
  contactButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noResultsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  homeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: 200,
  },
});

export default ResultScreen;