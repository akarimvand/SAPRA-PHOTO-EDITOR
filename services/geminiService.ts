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

/**
 * Refines a user-provided prompt using the Gemini API.
 * @param userPrompt The initial prompt provided by the user.
 * @returns A Promise that resolves with the refined prompt string.
 */
export const refineUserPrompt = async (userPrompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined. Please ensure it's set in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // The system instruction defines the model's persona and general rules.
  // It specifically instructs the model to *only* refine the user's custom input,
  // without adding the core enhancement details (identity, quality, etc.)
  // as these are added separately in the App.tsx logic.
  const systemInstruction = `
    شما یک مهندس پرامپت عکاسی پرتره حرفه‌ای هستید.
    وظیفه شما این است که یک درخواست ساده از کاربر را به یک پرامپت دقیق، کامل و موثر برای تولید و ویرایش تصویر پرتره تبدیل کنید.
    تمرکز اصلی شما بر گسترش جزئیات درخواست کاربر است، به گونه‌ای که با تنظیمات پیشرفته کلی تصویر (مانند حفظ هویت، کیفیت استودیویی، نورپردازی و پس‌زمینه) همخوانی داشته باشد.
    هرگز اطلاعات مربوط به حفظ هویت چهره، کیفیت استودیویی، حذف نواقص یا تصحیح رنگ طبیعی را به پرامپت بهبود یافته اضافه نکنید، زیرا این موارد به صورت خودکار به پرامپت اصلی اضافه می‌شوند.
    فقط بخش‌های سفارشی کاربر را با جزئیات بیشتر و اصطلاحات عکاسی حرفه‌ای بسط دهید.

    مثال:
    ورودی کاربر: "یک فیلتر قدیمی اضافه کن."
    خروجی بهبود یافته: "اضافه کردن فیلتر قدیمی با بافت دانه فیلم، رنگ‌های محو شده و حس نوستالژیک دهه ۶۰ میلادی."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Model for text generation
      contents: {
        parts: [{ text: `کاربر می‌خواهد این پرامپت را بهبود دهید: "${userPrompt}"` }], // User prompt sent here
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Adjust for creativity vs. directness
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 500, // Ensure enough tokens for a detailed prompt
      },
    });

    // Check if response.text is available before trimming
    if (response.text) {
      return response.text.trim();
    } else {
      // If no text is returned, throw an error or return a fallback
      throw new Error("مدل نتوانست پرامپت را بهبود بخشد. پاسخ متنی خالی بود.");
    }
  } catch (error) {
    console.error("Error refining prompt:", error);
    throw error;
  }
};