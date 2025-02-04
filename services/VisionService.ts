import * as FileSystem from 'expo-file-system';

export class VisionService {
  private apiKey: string;
  private apiEndpoint: string;

  constructor() {
    this.apiKey = 'AIzaSyBplRMIZbeaRDT2tDk27SZUsDAexQbAo6I'; 
    this.apiEndpoint = 'https://vision.googleapis.com/v1/images:annotate';
  }

  async detectText(imageUri: string): Promise<string | null> {
    try {
      if (!imageUri.startsWith('file://')) {
        throw new Error('Invalid image URI format');
      }

      // Read the image file and convert it to base64 using Expo FileSystem
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Construct the request body for Google Vision API
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'TEXT_DETECTION',
              },
            ],
          },
        ],
      };

      const apiUrl = `${this.apiEndpoint}?key=${this.apiKey}`;
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to fetch from Vision API');
      }

      const data = await apiResponse.json();

      if (
        !data.responses ||
        !data.responses[0] ||
        !data.responses[0].textAnnotations ||
        !data.responses[0].textAnnotations[0]
      ) {
        console.log('No text detected in the image');
        return null;
      }

      const text = data.responses[0].textAnnotations[0].description;
      console.log('Detected Text:', text);
      return this.extractNameFromText(text);
    } catch (error) {
      console.error('Vision API Error:', error);
      return null;
    }
  }

  extractNameFromText(text: string): string | null {
    const lines = text.split('\n');

    const namePattern = /^[A-Z]+(?: [A-Z]+)*(?:-[A-Z]+)*$/; // Name in all caps, can include spaces or hyphens

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (namePattern.test(trimmedLine)) {
        console.log('Detected Name:', trimmedLine);
        return trimmedLine;
      }
    }

    console.log('No name detected in the specified formats.');
    return null;
  }
}
