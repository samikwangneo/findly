import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '..';
import { ThemedText } from '../../components/ThemedText';
import { CLIP_API_URL } from '../../constants/Config';

type SearcherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Searcher'>;

type Props = {
  navigation: SearcherScreenNavigationProp;
};

const SearcherScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Assuming you have an input for this
  const [loading, setLoading] = useState<boolean>(false);
  
  const primaryColor = '#0a7ea4';
  const backgroundColor = '#11181C';

  const searchItems = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a description of your lost item");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${CLIP_API_URL}/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: searchQuery }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.best_match) {
        console.log('Best match:', data.best_match, 'Confidence:', data.confidence);
        // Format the result to match your Result screen expectations
        const searchResults = [
          {
            id: '1', // Assuming a single best match for simplicity
            imagePath: data.best_match, // Path or URL from the backend
            confidence: data.confidence,
          },
        ];
        
        navigation.navigate('Result', {
          searchQuery: searchQuery,
          searchResults: searchResults,
        });
      } else {
        console.log('Error:', data.error);
        alert("No match found: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error searching for items:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.instructions}>
          Enter a description of your lost item to search for matches.
        </ThemedText>
        
        {/* Assuming you have a TextInput for searchQuery */}
        <TextInput
          style={styles.input}
          placeholder="e.g., a red backpack"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: primaryColor, opacity: loading ? 0.7 : 1 }]}
          onPress={searchItems}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Search</Text>
          )}
        </TouchableOpacity>
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    color: '#000',
  },
  searchButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SearcherScreen;