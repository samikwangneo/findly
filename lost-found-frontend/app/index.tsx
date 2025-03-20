import React from 'react';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Platform } from 'react-native';
import { Image } from 'react-native';
import { ThemedText } from '../components/ThemedText'


import HomeScreen from './screens/HomeScreen';
import FinderScreen from './screens/FinderScreen';
import SearcherScreen from './screens/SearcherScreen';
import ResultScreen from './screens/ResultScreen';

import ParallaxScrollView from '@/components/ParallaxScrollView';

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
  const backgroundColor = '#11181C';
  const headerBackground = {
    light: '#A1CEDC',
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
              cardStyle: { backgroundColor },
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
                    height: 90,
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
    flex: 1,
    width: '100%', 
    height: '111%',
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  }
});
