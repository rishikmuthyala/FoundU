import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';

export default function LocationScreen() {
  const router = useRouter();
  const { name, imageUri, action } = useLocalSearchParams();

  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleLeaveItLocation = async () => {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is needed to save the UCard location.');
      return;
    }

    // Retrieve the current location
    const location = await Location.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    Alert.alert('Location Saved', `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`);
  };

  const handleSubmit = () => {
    // Add form submission logic here (including sending location if available)
    if (action === 'LEFT' && currentLocation) {
      console.log('Location data to save:', currentLocation);
    }

    router.push('/thank-you');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Additional Details</Text>

      {action === 'KEPT' && (
        <>
          <Text style={styles.label}>Your Email Address:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </>
      )}

      {action === 'LEFT' && (
        <>
          <Text style={styles.label}>Location Where Left:</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location"
            placeholderTextColor="#666"
          />
          <Button
            title="Use Current Location"
            onPress={handleLeaveItLocation}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
          />
        </>
      )}

      <Text style={styles.label}>Additional Notes (Optional):</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="Add extra details"
        placeholderTextColor="#666"
        multiline
        numberOfLines={3}
      />

      <Button
        title="Submit"
        onPress={handleSubmit}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: '#e0e0e0', // Light color for text
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#b0b0b0', // Light gray color for labels
    marginBottom: 5,
    textAlign: 'left',
    width: '100%',
  },
  input: {
    width: '100%',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#e0e0e0', // Light color for text input
    backgroundColor: '#1e1e1e', // Darker background for inputs
    marginBottom: 20,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#CC0000', // Maroon button color
    borderRadius: 8,
    paddingVertical: 12,
  },
});



