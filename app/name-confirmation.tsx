import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function NameConfirmationScreen() {
  const router = useRouter();
  const { name = 'No name detected' } = useLocalSearchParams();
  const initialName = Array.isArray(name) ? name[0] : name;
  const [enteredName, setEnteredName] = useState(initialName); // Initialize with the detected name or default message

  const handleConfirm = () => {
    if (typeof enteredName === 'string' && enteredName.trim() === '') {
      Alert.alert('Error', 'Please enter a name to confirm.');
      return;
    }
    router.push({ pathname: '/action-selection', params: { confirmedName: enteredName } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Name on UCard</Text>
      <TextInput
        style={styles.input}
        value={enteredName}
        onChangeText={setEnteredName}
        placeholder="Detected name"
        placeholderTextColor="#666"
        autoFocus
      />

      <Button title="Confirm" onPress={handleConfirm} containerStyle={styles.button} />
      <Button title="Back" onPress={() => router.back()} type="outline" containerStyle={styles.buttonOutline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#121212', // Dark background
    padding: 20 
  },
  title: { 
    fontSize: 26, 
    color: '#e0e0e0', 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  input: { 
    width: '80%', 
    borderColor: '#444', 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 10, 
    fontSize: 18, 
    color: '#e0e0e0', 
    backgroundColor: '#1e1e1e', 
    marginBottom: 20,
    textAlign: 'center'
  },
  button: { 
    width: '80%', 
    backgroundColor: '#CC0000', 
    borderRadius: 8 
  },
  buttonOutline: { 
    width: '80%', 
    borderRadius: 8, 
    borderColor: '#881c1c', 
    marginTop: 15 
  },
});







