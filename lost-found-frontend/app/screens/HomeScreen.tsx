import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '..';
import { useThemeColor } from '../../hooks/useThemeColor';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const primaryColor = '#0a7ea4'
  const textColor = '#fff'
  const backgroundColor = '#11181C'

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#11181C' }}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
          onError={(e) => console.log('Image error:', e.nativeEvent.error)}
        />
        <Text style={[styles.title, { color: primaryColor }]}>Lost & Found</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Reconnect with your belongings
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: primaryColor }]}
          onPress={() => navigation.navigate('Finder')}
        >
          <Text style={styles.buttonText}>I Found Something</Text>
          <Text style={styles.buttonSubtext}>Upload a photo of an item you found</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: primaryColor }]}
          onPress={() => navigation.navigate('Searcher')}
        >
          <Text style={styles.buttonText}>I Lost Something</Text>
          <Text style={styles.buttonSubtext}>Search for your lost item</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.7,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  optionButton: {
    borderRadius: 12,
    padding: 24,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
});

export default HomeScreen;