
import React, { useState, useCallback } from 'react';
import { enhanceImage, fileToBase64 } from './services/geminiService';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      fileToBase64(file)
        .then((base64) => {
          setSelectedImage(base64);
          setEnhancedImage(null); // Clear previous enhanced image
          setError(null);
        })
        .catch((err) => {
          console.error("Error converting file to base64:", err);
          setError("Failed to read image file.");
          setSelectedImage(null);
        });
    }
  };

  const handleEnhanceClick = useCallback(async () => {
    if (!selectedImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEnhancedImage(null);

    // Base instruction for identity preservation and quality
    let finalPrompt = `Take this portrait photo. Preserve the person's identity and facial features accurately at all times.`;

    // Add specific studio portrait enhancement details if no custom prompt
    if (!customPrompt.trim()) {
      finalPrompt += ` Enhance the image quality significantly, removing all scratches, tears, and imperfections. Transform it into a high-quality, professional studio portrait with soft, even lighting and a clean, neutral background. Apply natural color correction to the person's skin, hair, and clothing, making it look vibrant and realistic as if it were a modern color photograph. The final output should be a refined, aesthetically pleasing studio headshot.`;
    } else {
      // If there's a custom prompt, append it while maintaining the core identity preservation instruction.
      finalPrompt += ` Apply the following custom edits: "${customPrompt.trim()}". Ensure that the person's identity and facial features are maintained throughout these edits.`;
    }

    try {
      const result = await enhanceImage(selectedImage, finalPrompt);
      setEnhancedImage(result);
    } catch (err: any) {
      console.error("Image enhancement failed:", err);
      setError(`Image enhancement failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage, customPrompt]); // Depends on selectedImage and customPrompt

  const handleSaveImage = () => {
    if (enhancedImage) {
      const link = document.createElement('a');
      link.href = enhancedImage;
      link.download = 'enhanced_image.png'; // You can make this dynamic based on mime type if needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setError("No enhanced image to save.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center drop-shadow-lg">
        SAPRA PHOTO ENHANCER
      </h1>

      <div className="w-full max-w-4xl bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <label htmlFor="image-upload" className="flex-1 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md">
            Upload Image
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <button
            onClick={handleEnhanceClick}
            disabled={!selectedImage || isLoading}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Enhance Image'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-600 bg-opacity-80 p-4 rounded-lg mb-6 text-center shadow-lg">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"> {/* Added mb-6 here */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-3 text-center text-gray-200">Original Image</h2>
            <div className="flex items-center justify-center h-64 bg-gray-700 rounded-md overflow-hidden border-2 border-gray-600">
              {selectedImage ? (
                <img src={selectedImage} alt="Selected" className="max-h-full max-w-full object-contain" />
              ) : (
                <p className="text-gray-400">Upload an image to see it here.</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-3 text-center text-gray-200">Enhanced Image</h2>
            <div className="flex items-center justify-center h-64 bg-gray-700 rounded-md overflow-hidden border-2 border-gray-600">
              {isLoading ? (
                <div className="flex flex-col items-center text-blue-400">
                  <svg className="animate-spin h-8 w-8 text-blue-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Enhancing...</span>
                </div>
              ) : enhancedImage ? (
                <img src={enhancedImage} alt="Enhanced" className="max-h-full max-w-full object-contain" />
              ) : (
                <p className="text-gray-400">Your enhanced image will appear here.</p>
              )}
            </div>
          </div>
        </div>

        {enhancedImage && !isLoading && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleSaveImage}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center"
              aria-label="Save enhanced image"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              Save Enhanced Image
            </button>
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="custom-prompt" className="block text-gray-300 text-sm font-bold mb-2">
            Custom Edits (Optional):
          </label>
          <textarea
            id="custom-prompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe custom edits here (e.g., 'add a vintage filter', 'change background to a forest'). Identity will always be preserved."
            aria-label="Custom image editing prompt"
          ></textarea>
        </div>

      </div>

      <footer className="text-center text-gray-400 mt-auto p-4">
        Powered by Gemini API | Developed by amin naseri karimvand akarimvand@gmail.com +989366302800
      </footer>
    </div>
  );
};

export default App;
