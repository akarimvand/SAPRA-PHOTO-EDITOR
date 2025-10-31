
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

/**
 * Encodes a Uint8Array to a Base64 string.
 * @param bytes The Uint8Array to encode.
 * @returns The Base64 encoded string.
 */
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts a File object to a Base64 encoded string.
 * @param file The File object to convert.
 * @returns A Promise that resolves with the Base64 encoded string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Enhances an image using the Gemini API.
 * @param base64ImageData The Base64 encoded image data (including mime type prefix).
 * @param prompt The prompt for image enhancement.
 * @returns A Promise that resolves with the Base64 encoded enhanced image data.
 */
export const enhanceImage = async (base64ImageData: string, prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined. Please ensure it's set in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const [mimeType, data] = base64ImageData.split(';base64,');

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Model for general image generation/editing
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType.replace('data:', ''), // Extract actual mime type
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const enhancedImagePart = response.candidates?.[0]?.content?.parts?.[0];
    if (enhancedImagePart && enhancedImagePart.inlineData) {
      const base64ImageBytes: string = enhancedImagePart.inlineData.data;
      const imageUrl = `data:${enhancedImagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
      return imageUrl;
    } else {
      throw new Error("Failed to get enhanced image from API response.");
    }
  } catch (error) {
    console.error("Error enhancing image:", error);
    throw error;
  }
};
