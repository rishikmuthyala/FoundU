import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function ThankYouScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/');
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, router]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Thank You!</Text>
      <Text style={styles.subtitle}>The owner will be notified about their UCard.</Text>
      <Text style={styles.info}>Returning to home screen...</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 30, fontWeight: 'bold', color: '#CC0000', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#b0b0b0', textAlign: 'center', marginBottom: 20 },
  info: { fontSize: 14, color: '#808080' },
});

  
