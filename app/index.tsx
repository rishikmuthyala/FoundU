import React from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Button } from '@rneui/themed';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start(() => {
      router.push('/camera');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FoundU</Text>
      <Text style={styles.subtitle}>Helping return lost UCards to their owners</Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Button
          title="Found a UCard?"
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 34,
    color: '#CC0000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#b0b0b0',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#CC0000',
    paddingVertical: 15,
    borderRadius: 8,
  },
});



