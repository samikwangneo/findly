import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '..';
import { ThemedText } from '../../components/ThemedText';
import { API_URL } from '../../constants/Config';

const UMD_BUILDINGS = [
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

type SearcherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Searcher'>;

type Props = {
  navigation: SearcherScreenNavigationProp;
};

const SearcherScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lostLocation, setLostLocation] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const filteredBuildings = lostLocation
    ? UMD_BUILDINGS.filter((b) => b.toLowerCase().includes(lostLocation.toLowerCase()))
    : UMD_BUILDINGS;

  const searchItems = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a description of your lost item");
      return;
    }
    
    setLoading(true); // Start loading state
    
    try {
      const response = await fetch(`${API_URL}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: searchQuery, lostLocation }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.best_match) {
        console.log('Best match:', data.best_match, 'Confidence:', data.confidence, 'Location:', data.lostLocation);
        const searchResults = [{
          id: '1',
          imagePath: data.best_match,
          confidence: data.confidence,
          lostLocation: data.lostLocation,
        }];
        
        navigation.navigate('Result', { searchQuery, searchResults });
      } else {
        alert("No match found: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error searching for items:", error);
      alert("An error occurred: " + error);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Find Your Lost Item</ThemedText>
      
      <TextInput
        style={styles.input}
        placeholder="Describe your lost item (e.g., red backpack)"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Where did you lose it? (Leave blank if don't know)"
        placeholderTextColor="#888"
        value={lostLocation}
        onChangeText={(text) => {
          setLostLocation(text);
          setDropdownVisible(true);
        }}
        onFocus={() => setDropdownVisible(true)}
      />

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
            showsVerticalScrollIndicator={true} // Show scrollbar for clarity
          />
        </View>
      )}
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonPressed]}
        onPress={searchItems}
        disabled={loading}
      >
        <ThemedText style={styles.buttonText}>
          {loading ? 'Searching' : 'Search'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#11181C',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#085f7c', // Darker shade when pressed/searching
    opacity: 0.8, // Slightly faded
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdownContainer: {
    width: '100%',
    maxHeight: 240, // Limit height but allow scrolling
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#333',
    borderRadius: 8,
    width: '100%',
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    color: '#fff',
  },
});

export default SearcherScreen;