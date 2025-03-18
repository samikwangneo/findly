import React from 'react';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Platform } from 'react-native';
import { Image } from 'react-native';
import { ThemedText } from '../components/ThemedText'

// Import screens
import HomeScreen from './screens/HomeScreen';
import FinderScreen from './screens/FinderScreen';
import SearcherScreen from './screens/SearcherScreen';
import ResultScreen from './screens/ResultScreen';

// Import themed components similar to first code
import ParallaxScrollView from '@/components/ParallaxScrollView'; // Assuming this exists

// Define navigation param types
export type RootStackParamList = {
  Home: undefined;
  Finder: undefined;
  Searcher: undefined;
  Result: {
    searchQuery?: string;
    searchResults?: Array<{
      id: string;
      imagePath: string;
      confidence: number;
    }>;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const backgroundColor = '#11181C'; // Consistent dark background
  const headerBackground = {
    light: '#A1CEDC', // Matching first code's header colors
    dark: '#1D3D47'
  };

  return (
    <SafeAreaProvider style={styles.fullScreenContainer}>
        <NavigationIndependentTree>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: headerBackground.dark,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              cardStyle: { backgroundColor }, // Consistent background
            }}
          >
            <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
                header: () => (
                <View
                    style={{
                    backgroundColor: headerBackground.dark,
                    height: 90, // Adjust height as needed
                    position: 'relative',
                    }}
                >
                    
                    <View style={styles.titleContainer}>
                    </View>
                </View>
                ),
                headerShown: true,
            }}
            />
            <Stack.Screen
              name="Finder"
              component={FinderScreen}
              options={{ title: 'Upload Found Item' }}
            />
            <Stack.Screen
              name="Searcher"
              component={SearcherScreen}
              options={{ title: 'Search Lost Item' }}
            />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{ title: 'Search Results' }}
            />
          </Stack.Navigator>
        </NavigationIndependentTree>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,  // Takes full available space
    width: '100%',  // Full width
    height: '111%', // Full height
    position: 'absolute', // Absolute positioning
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  }
});
