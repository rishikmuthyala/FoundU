import { Stack } from 'expo-router';
import { ThemeProvider, createTheme } from '@rneui/themed';
import React from 'react';

const theme = createTheme({
  colors: {
    primary: '#CC0000', // Maroon button color
    background: '#121212', // Dark background for the app
    text: '#e0e0e0', // Light text for contrast on dark background
  },
  Text: {
    style: {
      color: '#e0e0e0', // Light text for all Text components
    },
  },
  Button: {
    raised: true,
    containerStyle: {
      borderRadius: 8,
      paddingVertical: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    buttonStyle: {
      backgroundColor: '#881c1c', // Maroon button color
    },
  },
});

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'UCard Finder', headerShown: false }} />
        <Stack.Screen name="camera" options={{ title: 'Take Photo' }} />
        <Stack.Screen name="name-confirmation" options={{ title: 'Confirm Name' }} />
        <Stack.Screen name="action-selection" options={{ title: 'Select Action' }} /> 
        <Stack.Screen name="location-screen" options={{ title: 'Provide Details' }} />
        <Stack.Screen name="thank-you" options={{ title: 'Thank You' }} />
      </Stack>
    </ThemeProvider>
  );
}