import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ActionSelectionScreen() {
  const router = useRouter();
  const { name, imageUri } = useLocalSearchParams();

  const handleSelection = (action: string) => {
    router.push({
      pathname: '/location-screen',
      params: {
        name,
        imageUri,
        action,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select an Action</Text>

      <Button
        title="Keep it with me"
        onPress={() => handleSelection('KEPT')}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
      />
      <Text style={styles.description}>Hold the card until contacted.</Text>

      <Button
        title="Left it somewhere"
        onPress={() => handleSelection('LEFT')}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
      />
      <Text style={styles.description}>Specify where you left it.</Text>

      <Button
        title="Other"
        onPress={() => handleSelection('OTHER')}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
      />
      <Text style={styles.description}>Provide additional details.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    color: '#e0e0e0', // Light text color
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 15, // Increased vertical spacing between buttons
  },
  button: {
    backgroundColor: '#CC0000', // Maroon button color
    borderRadius: 8,
    paddingVertical: 14, // Increased padding for better touch area
  },
  description: {
    fontSize: 15,
    color: '#b0b0b0', // Light gray color for description text
    textAlign: 'center',
    marginTop: 8, // Slight space above description
    marginBottom: 20, 
    paddingHorizontal: 15, 
  },
});




