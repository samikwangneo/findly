import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '..';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedText } from '../../components/ThemedText';
import { API_URL } from '../../constants/Config';

type LoserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Searcher'>;

type Props = {
  navigation: LoserScreenNavigationProp;
};

const LoserScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const primaryColor = '#0a7ea4'
  const backgroundColor = '#11181C'
  const inputBackground = '#fff'
  const placeholderColor = '#11181C'
  
  const searchItems = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a description of your lost item");
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would connect to your Python backend
      // For now, we'll simulate a response
      
      // Simulate API call with timeout
      setTimeout(() => {
        // Simulated response
        const simulatedResults = [
          {
            id: '1',
            imagePath: 'found_items/item1.jpg',
            confidence: 0.85,
          },
          {
            id: '2',
            imagePath: 'found_items/item2.jpg',
            confidence: 0.72,
          },
          {
            id: '3',
            imagePath: 'found_items/item3.jpg',
            confidence: 0.65,
          },
        ];
        
        // Navigate to results screen with the data
        navigation.navigate('Result', {
          searchQuery: searchQuery,
          searchResults: simulatedResults,
        });
        
        setLoading(false);
      }, 2000);
      
      // In a real app, this would be:
      /*
      const response = await fetch(`${API_URL}/search-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      const results = await response.json();
      
      navigation.navigate('Result', {
        searchQuery: searchQuery,
        searchResults: results.items,
      });
      */
      
    } catch (error) {
      console.error("Error searching for items:", error);
      alert("An error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.content}>
          <ThemedText style={styles.instructions}>
            Describe your lost item in detail. Include color, size, brand, and any distinctive features.
          </ThemedText>
          
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground }]}
            placeholder="e.g., a red backpack with black straps and a logo"
            placeholderTextColor={placeholderColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            multiline
            numberOfLines={3}
            blurOnSubmit={true}
            onSubmitEditing={Keyboard.dismiss}
            returnKeyType="done"
          />
          
          <ThemedText style={styles.helpText}>
            Our AI will analyze your description and find the best matches from the items people have found.
          </ThemedText>
          
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: primaryColor, opacity: loading ? 0.7 : 1 }]}
            onPress={() => {
              Keyboard.dismiss();
              searchItems();
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Search for My Item</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  helpText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
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

export default LoserScreen;