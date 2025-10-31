import React, { useState, useCallback, useMemo } from 'react';
import { enhanceImage, fileToBase64, refineUserPrompt } from './services/geminiService';
import { presetPrompts, promptBuildingBlocks } from './constants/prompts'; // Import from new file

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefiningPrompt, setIsRefiningPrompt] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>(presetPrompts[0].value); // Initialize with default "No preset"

  // New states for prompt building blocks
  const [selectedClothing, setSelectedClothing] = useState<string>('');
  const [selectedBackground, setSelectedBackground] = useState<string>('');
  const [selectedLighting, setSelectedLighting] = useState<string>('');
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');

  // UI state for enabling/disabling elements
  const isPresetActive = selectedPreset !== ''; // If any preset other than "No preset" is selected
  const isCustomInputActive = !isPresetActive; // Custom prompt and advanced settings are active if no preset is chosen

  const resetAdvancedSettings = useCallback(() => {
    setSelectedClothing('');
    setSelectedBackground('');
    setSelectedLighting('');
    setSelectedCamera('');
    setSelectedStyle('');
  }, []);

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
          console.error("خطا در تبدیل فایل به Base64:", err);
          setError("خطا: قادر به خواندن فایل تصویری نیست.");
          setSelectedImage(null);
        });
    }
  };

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPreset(value);
    setCustomPrompt(value === '' ? '' : presetPrompts.find(p => p.value === value)?.value || ''); // Set custom prompt only if it's a real preset
    
    // Always reset advanced settings when a preset is chosen or cleared
    resetAdvancedSettings();
  };

  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPrompt(e.target.value);
    // If user starts typing in custom prompt, clear preset selection
    if (e.target.value.trim() !== '' && isPresetActive) {
      setSelectedPreset('');
    }
  };

  const handleAdvancedSettingChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    // If user selects an advanced option, clear preset selection
    if (value !== '' && isPresetActive) {
      setSelectedPreset('');
    }
  };

  const handleRefinePrompt = useCallback(async () => {
    if (!customPrompt.trim()) {
      setError("لطفاً یک پرامپت برای بهبود وارد کنید.");
      return;
    }

    setIsRefiningPrompt(true);
    setError(null);

    try {
      const refined = await refineUserPrompt(customPrompt);
      setCustomPrompt(refined); // Update custom prompt with the refined version
      setError("پرامپت با موفقیت بهبود یافت.");
    } catch (err: any) {
      console.error("خطا در بهبود پرامپت:", err);
      setError(`خطا در بهبود پرامپت: ${err.message || 'خطای ناشناخته'}`);
    } finally {
      setIsRefiningPrompt(false);
    }
  }, [customPrompt]);

  const handleEnhanceClick = useCallback(async () => {
    if (!selectedImage) {
      setError("لطفاً ابتدا یک تصویر آپلود کنید.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEnhancedImage(null);

    let promptSegments: string[] = [];

    // 1. Core Identity & Quality Preservation (Minimal)
    promptSegments.push(`Create a photorealistic portrait of the person in the uploaded image. Ensure the identity and facial features are preserved with absolute accuracy. Enhance the image quality significantly, remove all scratches, tears, and imperfections. Transform it into a high-quality, professional studio portrait.`);

    if (isPresetActive) {
      // If a preset is selected, use its full value as the primary modifier
      promptSegments.push(selectedPreset);
    } else {
      // Otherwise, build from advanced settings and custom prompt
      // Ensure defaults are always used if no specific option is chosen
      promptSegments.push(`Clothing and accessories: ${selectedClothing || 'Retain existing clothing and accessories, applying natural color correction.'}`);
      promptSegments.push(`Background and environment: ${selectedBackground || 'clean, neutral, professional studio setting.'}`);
      promptSegments.push(`Lighting and atmosphere: ${selectedLighting || 'soft, uniform, studio-quality.'}`);
      promptSegments.push(`Camera and settings: ${selectedCamera || 'DSLR quality, professional photography.'}`);
      promptSegments.push(`Style notes: ${selectedStyle || 'lively, realistic, modern color photo, cinematic, dreamy, and ultra-realistic, 4K.'}`);

      if (customPrompt.trim()) {
        promptSegments.push(`Additional specific details and modifications: "${customPrompt.trim()}".`);
      }
    }

    const finalPrompt = promptSegments.join(' ');
    console.log("Final Prompt:", finalPrompt); // For debugging purposes

    try {
      const result = await enhanceImage(selectedImage, finalPrompt);
      setEnhancedImage(result);
    } catch (err: any) {
      console.error("خطا در بهبود تصویر:", err);
      setError(`خطا در بهبود تصویر: ${err.message || 'خطای ناشناخته'}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage, isPresetActive, selectedPreset, selectedClothing, selectedBackground, selectedLighting, selectedCamera, selectedStyle, customPrompt]);

  const handleSaveImage = () => {
    if (enhancedImage) {
      const link = document.createElement('a');
      link.href = enhancedImage;
      link.download = 'تصویر_بهبود_یافته_SAPRA.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setError("تصویر بهبود یافته‌ای برای ذخیره وجود ندارد.");
    }
  };

  const MemoizedImageDisplays = useMemo(() => (
    <>
      <div className="bg-gray-800 p-4 rounded-lg shadow-inner flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-3 text-center text-gray-200" dir="rtl">تصویر اصلی</h2>
        <div className="flex items-center justify-center w-full h-64 bg-gray-700 rounded-md overflow-hidden border-2 border-gray-600">
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" className="max-h-full max-w-full object-contain" />
          ) : (
            <p className="text-gray-400">یک تصویر آپلود کنید تا اینجا ببینید.</p>
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-inner flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-3 text-center text-gray-200" dir="rtl">تصویر بهبود یافته</h2>
        <div className="flex items-center justify-center w-full h-64 bg-gray-700 rounded-md overflow-hidden border-2 border-gray-600">
          {isLoading ? (
            <div className="flex flex-col items-center text-blue-400">
              <svg className="animate-spin h-8 w-8 text-blue-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>در حال بهبود...</span>
            </div>
          ) : enhancedImage ? (
            <img src={enhancedImage} alt="Enhanced" className="max-h-full max-w-full object-contain" />
          ) : (
            <p className="text-gray-400">تصویر بهبود یافته شما اینجا ظاهر می‌شود.</p>
          )}
        </div>
      </div>
    </>
  ), [selectedImage, isLoading, enhancedImage]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center drop-shadow-lg font-sans">
        SAPRA PHOTO ENHANCER
      </h1>

      <div className="w-full max-w-6xl bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-8 flex flex-col lg:flex-row gap-8">
        {/* Control Panel - Right Column (in RTL layout) */}
        <div className="lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1"> {/* order for responsive stacking */}
          <div className="flex flex-col gap-4">
            <label htmlFor="image-upload" className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md" dir="rtl" aria-label="آپلود تصویر">
              آپلود تصویر
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
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              dir="rtl"
              aria-label="بهبود تصویر"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'بهبود تصویر'
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-600 bg-opacity-80 p-4 rounded-lg text-center shadow-lg" role="alert" dir="rtl">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <label htmlFor="preset-prompts" className="block text-gray-300 text-sm font-bold mb-2" dir="rtl">
              پرامپت‌های آماده:
            </label>
            <select
              id="preset-prompts"
              value={selectedPreset}
              onChange={handlePresetChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              dir="rtl"
              aria-label="انتخاب پرامپت آماده"
            >
              {presetPrompts.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <label htmlFor="custom-prompt" className="block text-gray-300 text-sm font-bold mb-2" dir="rtl">
              ادیت‌های سفارشی (اختیاری):
            </label>
            <textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={handleCustomPromptChange}
              rows={4}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="تغییرات سفارشی خود را اینجا بنویسید (مثلاً: 'یک فیلتر قدیمی اضافه کن', 'پس‌زمینه را به یک جنگل تغییر بده'). هویت چهره همیشه حفظ خواهد شد."
              dir="rtl"
              aria-label="فیلد ورودی پرامپت سفارشی"
              disabled={isPresetActive} // Disable if a preset is active
            ></textarea>
            <button
              onClick={handleRefinePrompt}
              disabled={!customPrompt.trim() || isRefiningPrompt || isPresetActive} // Disable if preset is active
              className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              dir="rtl"
              aria-label="بهبود پرامپت"
            >
              {isRefiningPrompt ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'بهبود پرامپت'
              )}
            </button>
          </div>

          {/* Advanced Prompt Settings */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <h3 className="text-gray-300 text-lg font-bold mb-4" dir="rtl">تنظیمات پیشرفته پرامپت:</h3>
            
            {/* Clothing & Accessories */}
            <div className="mb-4">
              <label htmlFor="clothing-accessories" className="block text-gray-300 text-sm font-bold mb-2" dir="rtl">
                {promptBuildingBlocks.clothingAccessories.label}:
              </label>
              <select
                id="clothing-accessories"
                value={selectedClothing}
                onChange={(e) => handleAdvancedSettingChange(setSelectedClothing, e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                dir="rtl"
                aria-label="انتخاب لباس و لوازم جانبی"
                disabled={isPresetActive} // Disable if a preset is active
              >
                {promptBuildingBlocks.clothingAccessories.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Background & Environment */}
            <div className="mb-4">
              <label htmlFor="background-environment" className="block text-gray-300 text-sm font-bold mb-2" dir="rtl">
                {promptBuildingBlocks.backgroundEnvironment.label}:
              </label>
              <select
                id="background-environment"
                value={selectedBackground}
                onChange={(e) => handleAdvancedSettingChange(setSelectedBackground, e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                dir="rtl"
                aria-label="انتخاب پس‌زمینه و محیط"
                disabled={isPresetActive} // Disable if a preset is active
              >
                {promptBuildingBlocks.backgroundEnvironment.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Lighting & Atmosphere */}
            <div className="mb-4">
              <label htmlFor="lighting-atmosphere" className="block text-gray-300 text-sm font-bold mb-2" dir="rtl">
                {promptBuildingBlocks.lightingAtmosphere.label}:
              </label>
              <select
                id="lighting-atmosphere"
                value={selectedLighting}
                onChange={(e) => handleAdvancedSettingChange(setSelectedLighting, e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                dir="rtl"
                aria-label="انتخاب نورپردازی و اتمسفر"
                disabled={isPresetActive} // Disable if a preset is active
              >
                {promptBuildingBlocks.lightingAtmosphere.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Camera & Settings */}
            <div className="mb-4">
              <label htmlFor="camera-settings" className="block text-gray-300 text-sm font-bold mb-2" dir="rtl">
                {promptBuildingBlocks.cameraSettings.label}:
              </label>
              <select
                id="camera-settings"
                value={selectedCamera}
                onChange={(e) => handleAdvancedSettingChange(setSelectedCamera, e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                dir="rtl"
                aria-label="انتخاب دوربین و تنظیمات"
                disabled={isPresetActive} // Disable if a preset is active
              >
                {promptBuildingBlocks.cameraSettings.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Style Notes */}
            <div>
              <label htmlFor="style-notes" className="block text-gray-300 text-sm font-bold mb-2" dir="rtl">
                {promptBuildingBlocks.styleNotes.label}:
              </label>
              <select
                id="style-notes"
                value={selectedStyle}
                onChange={(e) => handleAdvancedSettingChange(setSelectedStyle, e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                dir="rtl"
                aria-label="انتخاب نکات سبک و استایل"
                disabled={isPresetActive} // Disable if a preset is active
              >
                {promptBuildingBlocks.styleNotes.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

          </div> {/* End Advanced Prompt Settings */}
        </div>

        {/* Image Display & Save Button - Left Column (in RTL layout) */}
        <div className="lg:w-2/3 flex flex-col gap-6 order-1 lg:order-2"> {/* order for responsive stacking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MemoizedImageDisplays}
          </div>

          {enhancedImage && !isLoading && (
            <div className="flex justify-center">
              <button
                onClick={handleSaveImage}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center"
                dir="rtl"
                aria-label="ذخیره تصویر بهبود یافته"
              >
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                ذخیره تصویر بهبود یافته
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center text-gray-400 mt-auto p-4" dir="rtl">
        قدرت گرفته از Gemini API | توسعه داده شده توسط امین نصیری کریم‌وند akarimvand@gmail.com +۹۸۹۳۶۶۳۰۲۸۰۰
      </footer>
    </div>
  );
};

export default App;