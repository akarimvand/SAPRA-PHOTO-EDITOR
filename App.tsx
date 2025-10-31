
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { enhanceImage, fileToBase64, refineUserPrompt } from './services/geminiService';
import { PromptOption, ClothingOption, PromptData } from './types'; // Import types

interface ImageModalProps {
  src: string;
  alt: string;
  title: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, title, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image/modal content
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="بستن"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h3 id="image-modal-title" className="sr-only">{title}</h3> {/* Screen reader only title */}
        <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain" />
      </div>
    </div>
  );
};

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="relative bg-white text-gray-800 rounded-lg shadow-xl max-w-3xl w-full p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 bg-gray-200 rounded-full p-1 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="بستن راهنما"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 id="help-modal-title" className="text-2xl font-bold mb-4 text-blue-700">راهنمای استفاده از SAPRA PHOTO ENHANCER</h2>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">۱. آپلود تصویر:</h3>
          <p className="mb-2">برای شروع، روی دکمه <span className="font-bold text-blue-600">"آپلود تصویر"</span> کلیک کنید و یک فایل تصویری (JPEG, PNG و غیره) را از دستگاه خود انتخاب نمایید. تصویر انتخاب شده در پنل <span className="font-bold">"تصویر اصلی"</span> نمایش داده خواهد شد.</p>
          <p className="mb-2">جهت گرفتن بهترین نتیجه، یک تصویر با وضوح مناسب و نورپردازی متعادل آپلود کنید.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">۲. انتخاب پرامپت‌ها و تنظیمات:</h3>
          <p className="mb-2">شما می‌توانید تصویر خود را با استفاده از ترکیبی از گزینه‌های آماده و سفارشی‌سازی‌های پیشرفته، بهبود بخشید:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><span className="font-bold text-emerald-600">پرامپت‌های آماده:</span> از لیست کشویی <span className="font-bold">"پرامپت‌های آماده"</span> یک سبک کلی برای پرتره خود انتخاب کنید (مثلاً "پرتره استودیویی کلاسیک"، "استایل خیابانی شهری").</li>
            <li><span className="font-bold text-orange-600">ادیت‌های سفارشی:</span> در قسمت <span className="font-bold">"ادیت‌های سفارشی"</span> می‌توانید توضیحات متنی دلخواه خود را برای تغییرات خاص اضافه کنید (مثلاً "یک فیلتر قدیمی اضافه کن"، "پس‌زمینه را به یک جنگل تغییر بده").
              <ul className="list-disc list-inside mt-1 mr-4 text-sm text-gray-600">
                <li>می‌توانید روی دکمه <span className="font-bold text-yellow-700">"بهبود پرامپت"</span> کلیک کنید تا هوش مصنوعی پرامپت سفارشی شما را دقیق‌تر و حرفه‌ای‌تر کند.</li>
              </ul>
            </li>
            <li><span className="font-bold text-indigo-600">تنظیمات پیشرفته پرامپت:</span>
              <p className="mt-1 mb-1">این بخش به شما امکان می‌دهد جزئیات دقیقی را برای پرتره خود مشخص کنید:</p>
              <ul className="list-disc list-inside mr-4 space-y-1 text-sm text-gray-600">
                <li><span className="font-bold">نوع عکس (تک نفره/دسته جمعی):</span> مشخص کنید که عکس "تک نفره" است یا "دسته جمعی". این به مدل کمک می‌کند تا هنگام ویرایش، هویت همه چهره‌ها را با دقت بیشتری حفظ کند و کیفیت تصویر برای تعداد افراد مختلف بهینه شود.</li>
                <li><span className="font-bold">گروه سنی:</span> "بزرگسال" یا "کودک" را انتخاب کنید. این گزینه، گزینه‌های لباس را فیلتر می‌کند.</li>
                <li><span className="font-bold">جنسیت:</span> "مرد" یا "زن" را انتخاب کنید. این گزینه نیز بر فیلترینگ لباس‌ها تاثیر می‌گذارد.</li>
                <li><span className="font-bold">کادربندی و برش:</span> نمای دوربین را مشخص کنید (مانند "تمام قد"، "چهره بسته").</li>
                <li><span className="font-bold">لباس و لوازم جانبی:</span> نوع لباس را بر اساس جنسیت و گروه سنی انتخاب کنید.</li>
                <li><span className="font-bold">پس‌زمینه و محیط:</span> محیط پس‌زمینه را تغییر دهید (مانند "ساحل"، "کوه برفی").</li>
                <li><span className="font-bold">نورپردازی و اتمسفر:</span> حالت و نوع نورپردازی را انتخاب کنید (مانند "نور گرم طلایی"، "نورپردازی رامبراند").</li>
                <li><span className="font-bold">دوربین و تنظیمات:</span> نوع دوربین و لنز مورد استفاده را شبیه‌سازی کنید.</li>
                <li><span className="font-bold">نکات سبک و استایل:</span> سبک کلی هنری تصویر را تعیین کنید (مانند "سینمایی و رویایی"، "پانک راک").</li>
                <li><span className="font-bold">اشیای همراه در صحنه:</span> اشیای اضافی را به صحنه اضافه کنید (مانند "کنار خودروی کلاسیک"، "مجسمه باستانی ایرانی").</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">۳. بهبود تصویر:</h3>
          <p className="mb-2">پس از انتخاب همه گزینه‌های مورد نظر، روی دکمه <span className="font-bold text-emerald-600">"بهبود تصویر"</span> کلیک کنید. هوش مصنوعی شروع به پردازش تصویر و ایجاد پرتره بهبود یافته شما خواهد کرد. این فرآیند ممکن است چند لحظه طول بکشد.</p>
          <p className="mb-2">تصویر بهبود یافته در پنل <span className="font-bold">"تصویر بهبود یافته"</span> نمایش داده می‌شود. شما می‌توانید با کلیک بر روی هر یک از تصاویر (اصلی یا بهبود یافته)، آن را در اندازه بزرگتر مشاهده کنید.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">۴. ذخیره تصویر:</h3>
          <p className="mb-2">هنگامی که تصویر بهبود یافته نمایش داده شد، می‌توانید روی دکمه <span className="font-bold text-purple-600">"ذخیره تصویر بهبود یافته"</span> کلیک کنید تا تصویر نهایی را در دستگاه خود ذخیره نمایید.</p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">۵. نکات مهم:</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>حفظ هویت چهره در اولویت است، مدل تلاش می‌کند ویژگی‌های اصلی را حفظ کند.</li>
            <li>کیفیت استودیویی، تصحیح رنگ طبیعی و حذف نواقص به صورت خودکار اعمال می‌شوند.</li>
            <li>تغییرات را به تدریج اعمال کنید و نتایج را مشاهده نمایید.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefiningPrompt, setIsRefiningPrompt] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  // State for loaded prompt data
  const [promptData, setPromptData] = useState<PromptData | null>(null);

  // States for selected prompt building blocks
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [selectedClothing, setSelectedClothing] = useState<string>('');
  const [selectedBackground, setSelectedBackground] = useState<string>('');
  const [selectedLighting, setSelectedLighting] = useState<string>('');
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedFraming, setSelectedFraming] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>(''); 
  const [selectedPropObject, setSelectedPropObject] = useState<string>('');
  const [selectedPhotoSubject, setSelectedPhotoSubject] = useState<string>('');

  // Add state for modals
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [currentModalImage, setCurrentModalImage] = useState<string | null>(null);
  const [currentModalImageTitle, setCurrentModalImageTitle] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);


  // Load prompt data from JSON files on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          presets, framing, gender, ageGroup, clothing, backgrounds,
          lighting, cameras, styles, propsObjects, photoSubject
        ] = await Promise.all([
          fetch('/data/presets.json').then(res => res.json()),
          fetch('/data/framing.json').then(res => res.json()),
          fetch('/data/gender.json').then(res => res.json()),
          fetch('/data/ageGroup.json').then(res => res.json()),
          fetch('/data/clothing.json').then(res => res.json()),
          fetch('/data/backgrounds.json').then(res => res.json()),
          fetch('/data/lighting.json').then(res => res.json()),
          fetch('/data/cameras.json').then(res => res.json()),
          fetch('/data/styles.json').then(res => res.json()),
          fetch('/data/propsObjects.json').then(res => res.json()),
          fetch('/data/photoSubject.json').then(res => res.json()), // Load photo subject data
        ]);
        setPromptData({
          presets, framing, gender, ageGroup, clothing, backgrounds,
          lighting, cameras, styles, propsObjects, photoSubject
        });
        // Set default selections ensuring the array is not empty
        setSelectedPreset(presets[0]?.value || ''); 
        setSelectedClothing(clothing[0]?.value || '');
        setSelectedBackground(backgrounds[0]?.value || '');
        setSelectedLighting(lighting[0]?.value || '');
        setSelectedCamera(cameras[0]?.value || '');
        setSelectedStyle(styles[0]?.value || '');
        setSelectedFraming(framing[0]?.value || '');
        setSelectedGender(gender[0]?.value || '');
        setSelectedAgeGroup(ageGroup[0]?.value || '');
        setSelectedPropObject(propsObjects[0]?.value || '');
        setSelectedPhotoSubject(photoSubject[0]?.value || '');


      } catch (error) {
        console.error("Failed to load prompt data:", error);
        setError("خطا در بارگذاری گزینه‌های پرامپت.");
      }
    };
    loadData();
  }, []); // Empty dependency array means this runs once on mount

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
    setSelectedPreset(event.target.value);
  };

  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPrompt(e.target.value);
  };

  const handleAdvancedSettingChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
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
      // Set a success message for a short period
      setError("پرامپت با موفقیت بهبود یافت.");
      setTimeout(() => setError(null), 3000); // Clear after 3 seconds
    } catch (err: any) {
      console.error("خطا در بهبود پرامپت:", err);
      setError(`خطا در بهبود پرامپت: ${err.message || 'خطای ناشناخته'}`);
    } finally {
      setIsRefiningPrompt(false);
    }
  }, [customPrompt]);

  // Filter clothing options based on selected gender and age group
  const filteredClothingOptions = useMemo(() => {
    if (!promptData) return [];

    let options = promptData.clothing;

    if (selectedAgeGroup === 'child') {
      options = options.filter(item => item.gender === 'child' || item.gender === 'unisex');
    } else { // Adult or default age group
      if (selectedGender === 'male') {
        options = options.filter(item => item.gender === 'male' || item.gender === 'unisex');
      } else if (selectedGender === 'female') {
        options = options.filter(item => item.gender === 'female' || item.gender === 'unisex');
      } else { // No specific gender selected, show all unisex and default
        // If gender is default, and age is default/adult, show all unisex and also male/female options
        options = promptData.clothing.filter(item => item.gender === 'unisex' || item.value === '');
        // For default gender and adult age, include all adult clothing options.
        if (selectedAgeGroup !== 'child') {
          options = [...options, ...promptData.clothing.filter(item => item.gender === 'male' || item.gender === 'female')];
        }
      }
    }
    // Ensure the default empty option is always available and unique
    const defaultOption = promptData.clothing.find(item => item.value === '');
    if (defaultOption && !options.some(item => item.value === '')) {
      options = [defaultOption, ...options];
    }
    // Remove duplicates
    return Array.from(new Map(options.map(item => [item.value, item])).values());
  }, [promptData, selectedGender, selectedAgeGroup]);


  const handleEnhanceClick = useCallback(async () => {
    if (!selectedImage) {
      setError("لطفاً ابتدا یک تصویر آپلود کنید.");
      return;
    }
    if (!promptData) { // Ensure data is loaded
      setError("در حال بارگذاری گزینه‌های پرامپت. لطفا چند لحظه صبر کنید.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEnhancedImage(null);

    let promptSegments: string[] = [];
    
    // 1. Core Identity & Quality Preservation (Always included, adapted for single/group)
    if (selectedPhotoSubject === 'group') {
      promptSegments.push(`Create a photorealistic portrait of all individuals in the uploaded image. Ensure their identities and facial features are preserved with absolute accuracy. Enhance the image quality significantly, remove all scratches, tears, and imperfections. Transform it into a high-quality, professional studio portrait with natural color correction.`);
    } else { // Default or 'single'
      promptSegments.push(`Create a photorealistic portrait of the person in the uploaded image. Ensure the identity and facial features are preserved with absolute accuracy. Enhance the image quality significantly, remove all scratches, tears, and imperfections. Transform it into a high-quality, professional studio portrait with natural color correction.`);
    }

    // 2. Age Group (if specified) and Gender (if specified) - This should come early to set the context for the subject.
    let subjectDescription = "";
    if (selectedAgeGroup === 'child') {
        subjectDescription += "A portrait of a young ";
        if (selectedGender === 'male') {
            subjectDescription += "boy ";
        } else if (selectedGender === 'female') {
            subjectDescription += "girl ";
        } else {
            subjectDescription += "child ";
        }
    } else if (selectedAgeGroup === 'adult') {
        subjectDescription += "A portrait of an adult ";
        if (selectedGender === 'male') {
            subjectDescription += "man ";
        } else if (selectedGender === 'female') {
            subjectDescription += "woman ";
        } else {
            subjectDescription += "individual ";
        }
    } else { // Default age group, but gender might be selected
        if (selectedGender === 'male') {
            subjectDescription += "A portrait of a male individual ";
        } else if (selectedGender === 'female') {
            subjectDescription += "A portrait of a female individual ";
        } else {
            // No specific age or gender, let the model decide, or rely on image context
        }
    }
    if (subjectDescription && selectedPhotoSubject !== 'group') { // Apply only if not a group photo
        promptSegments.push(subjectDescription.trim() + ".");
    } else if (subjectDescription && selectedPhotoSubject === 'group') {
      // For group photos, individual age/gender descriptions are less impactful unless specified globally
      // We can add a more general statement or omit if individual descriptions conflict.
      // For now, let's keep it simple and focus on 'group' overriding specific subject description.
    }


    // 3. Framing/Crop (if specified) - Defines how much of the subject is visible.
    if (selectedFraming) {
      promptSegments.push(`Framing: ${selectedFraming}.`);
    }

    // 4. Add selected preset if not "No preset"
    if (selectedPreset) {
      promptSegments.push(selectedPreset);
    }

    // 5. Add selected advanced settings if they are not their default (empty string)
    if (selectedClothing) {
      promptSegments.push(`Clothing and accessories: ${selectedClothing}.`);
    }
    if (selectedBackground) {
      promptSegments.push(`Background and environment: ${selectedBackground}.`);
    }
    if (selectedLighting) {
      promptSegments.push(`Lighting and atmosphere: ${selectedLighting}.`);
    }
    if (selectedCamera) {
      promptSegments.push(`Camera and settings: ${selectedCamera}.`);
    }
    if (selectedStyle) {
      promptSegments.push(`Style notes: ${selectedStyle}.`);
    }
    
    // 6. Add props/objects (if specified) - These add contextual elements around the subject.
    if (selectedPropObject) {
      promptSegments.push(`Include in the scene: ${selectedPropObject}.`);
    }

    // 7. Finally, add any custom prompt text for granular details
    if (customPrompt.trim()) {
      promptSegments.push(`Additional specific details and modifications: "${customPrompt.trim()}".`);
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
  }, [selectedImage, promptData, selectedPreset, selectedClothing, selectedBackground, selectedLighting, selectedCamera, selectedStyle, selectedFraming, selectedGender, selectedAgeGroup, selectedPropObject, customPrompt, selectedPhotoSubject]);

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

  const openImageModal = (src: string, title: string) => {
    setCurrentModalImage(src);
    setCurrentModalImageTitle(title);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setCurrentModalImage(null);
    setCurrentModalImageTitle(null);
  };

  const MemoizedImageDisplays = useMemo(() => (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-200">
        <h2 className="text-xl font-semibold mb-3 text-center text-gray-800" dir="rtl">تصویر اصلی</h2>
        <div 
          className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-md overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors duration-200"
          onClick={() => selectedImage && openImageModal(selectedImage, "تصویر اصلی")}
          role="button"
          tabIndex={0}
          aria-label="نمایش تصویر اصلی بزرگتر"
        >
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" className="max-h-full max-w-full object-contain" />
          ) : (
            <p className="text-gray-500">یک تصویر آپلود کنید تا اینجا ببینید.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-200">
        <h2 className="text-xl font-semibold mb-3 text-center text-gray-800" dir="rtl">تصویر بهبود یافته</h2>
        <div 
          className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-md overflow-hidden border-2 border-gray-300"
          onClick={() => enhancedImage && !isLoading && openImageModal(enhancedImage, "تصویر بهبود یافته")}
          role="button"
          tabIndex={0}
          aria-label="نمایش تصویر بهبود یافته بزرگتر"
        >
          {isLoading ? (
            <div className="flex flex-col items-center text-blue-600">
              <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>در حال بهبود...</span>
            </div>
          ) : enhancedImage ? (
            <img src={enhancedImage} alt="Enhanced" className="max-h-full max-w-full object-contain cursor-pointer hover:border-blue-500 transition-colors duration-200" />
          ) : (
            <p className="text-gray-500">تصویر بهبود یافته شما اینجا ظاهر می‌شود.</p>
          )}
        </div>
      </div>
    </>
  ), [selectedImage, isLoading, enhancedImage]);


  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center drop-shadow-sm font-sans text-gray-900">
          SAPRA PHOTO ENHANCER
        </h1>
        <button
          onClick={() => setShowHelpModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow-md flex items-center"
          dir="rtl"
          aria-label="راهنما"
        >
          <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5L6 11H5a1 1 0 000 2h1a1 1 0 00.867.5l2-3.5 2 3.5A1 1 0 0013 13h1a1 1 0 100-2h-1l-2-3.5a1 1 0 00-.867-.5z" clipRule="evenodd"></path></svg>
          راهنما
        </button>
      </header>


      <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl p-6 sm:p-8 lg:p-10 mb-8 flex flex-col lg:flex-row gap-8">
        {/* Control Panel - Right Column (in RTL layout) */}
        <div className="lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1"> {/* order for responsive stacking */}
          <div className="flex flex-col gap-4">
            <label htmlFor="image-upload" className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md" dir="rtl" aria-label="آپلود تصویر">
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
              disabled={!selectedImage || isLoading || !promptData}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            <div className={`bg-${error.includes('با موفقیت') ? 'green-100 text-green-700' : 'red-100 text-red-700'} p-4 rounded-lg text-center shadow-md border ${error.includes('با موفقیت') ? 'border-green-300' : 'border-red-300'}`} role="alert" dir="rtl">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {promptData ? (
            <>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200">
                <label htmlFor="preset-prompts" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                  پرامپت‌های آماده:
                </label>
                <select
                  id="preset-prompts"
                  value={selectedPreset}
                  onChange={handlePresetChange}
                  className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                  dir="rtl"
                  aria-label="انتخاب پرامپت آماده"
                >
                  {promptData.presets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200">
                <label htmlFor="custom-prompt" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                  ادیت‌های سفارشی (اختیاری):
                </label>
                <textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={handleCustomPromptChange}
                  rows={4}
                  className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="تغییرات سفارشی خود را اینجا بنویسید (مثلاً: 'یک فیلتر قدیمی اضافه کن', 'پس‌زمینه را به یک جنگل تغییر بده')."
                  dir="rtl"
                  aria-label="فیلد ورودی پرامپت سفارشی"
                ></textarea>
                <button
                  onClick={handleRefinePrompt}
                  disabled={!customPrompt.trim() || isRefiningPrompt}
                  className="mt-4 w-full bg-gradient-to-r from-yellow-600 to-orange-700 hover:from-yellow-700 hover:to-orange-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
              <div className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-gray-700 text-lg font-bold mb-4" dir="rtl">تنظیمات پیشرفته پرامپت:</h3>
              
                {/* Photo Subject (Single/Group) */}
                <div className="mb-4">
                  <label htmlFor="photo-subject" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                    نوع عکس:
                  </label>
                  <select
                    id="photo-subject"
                    value={selectedPhotoSubject}
                    onChange={(e) => handleAdvancedSettingChange(setSelectedPhotoSubject, e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                    dir="rtl"
                    aria-label="انتخاب نوع عکس (تک نفره یا دسته جمعی)"
                  >
                    {promptData.photoSubject.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age Group */}
                <div className="mb-4">
                  <label htmlFor="age-group" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                    گروه سنی:
                  </label>
                  <select
                    id="age-group"
                    value={selectedAgeGroup}
                    onChange={(e) => handleAdvancedSettingChange(setSelectedAgeGroup, e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                    dir="rtl"
                    aria-label="انتخاب گروه سنی"
                  >
                    {promptData.ageGroup.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div className="mb-4">
                  <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                    جنسیت:
                  </label>
                  <select
                    id="gender"
                    value={selectedGender}
                    onChange={(e) => handleAdvancedSettingChange(setSelectedGender, e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                    dir="rtl"
                    aria-label="انتخاب جنسیت"
                  >
                    {promptData.gender.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Framing & Crop */}
                <div className="mb-4">
                  <label htmlFor="framing-crop" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                    کادربندی و برش:
                  </label>
                  <select
                    id="framing-crop"
                    value={selectedFraming}
                    onChange={(e) => handleAdvancedSettingChange(setSelectedFraming, e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                    dir="rtl"
                    aria-label="انتخاب کادربندی و برش"
                  >
                    {promptData.framing.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Clothing & Accessories */}
                <div className="mb-4">
                  <label htmlFor="clothing-accessories" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                    لباس و لوازم جانبی:
                  </label>
                  <select
                    id="clothing-accessories"
                    value={selectedClothing}
                    onChange={(e) => handleAdvancedSettingChange(setSelectedClothing, e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                    dir="rtl"
                    aria-label="انتخاب لباس و لوازم جانبی"
                  >
                    {filteredClothingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Background & Environment */}
                <div className="mb-4">
                  <label htmlFor="background-environment" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                    پس‌زمینه و محیط:
                  </label>
                  <select
                    id="background-environment"
                    value={selectedBackground}
                    onChange={(e) => handleAdvancedSettingChange(setSelectedBackground, e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                    dir="rtl"
                    aria-label="انتخاب پس‌زمینه و محیط"
                  >
                    {promptData.backgrounds.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lighting & Atmosphere */}
                <div className="mb-4">
                  <label htmlFor="lighting-atmosphere" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                    نورپردازی و اتمسفر:
                  </label>
                  <select
                    id="lighting-atmosphere"
                    value={selectedLighting}
                    onChange={(e) => handleAdvancedSettingChange(setSelectedLighting, e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                    dir="rtl"
                    aria-label="انتخاب نورپردازی و اتمسفر"
                  >
                    {promptData.lighting.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Camera & Settings */}
                <div className="mb-4">
                  <label htmlFor="camera-settings" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                    دوربین و تنظیمات:
                  </label>
                  <select
                    id="camera-settings"
                    value={selectedCamera}
                    onChange={(e) => handleAdvancedSettingChange(setSelectedCamera, e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                    dir="rtl"
                    aria-label="انتخاب دوربین و تنظیمات"
                  >
                    {promptData.cameras.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Style Notes */}
                <div className="mb-4">
                  <label htmlFor="style-notes" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                    نکات سبک و استایل:
                  </label>
                  <select
                    id="style-notes"
                    value={selectedStyle}
                    onChange={(e) => handleAdvancedSettingChange(setSelectedStyle, e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                    dir="rtl"
                    aria-label="انتخاب نکات سبک و استایل"
                  >
                    {promptData.styles.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Props / Objects */}
                <div>
                  <label htmlFor="props-objects" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                    اشیای همراه در صحنه:
                  </label>
                  <select
                    id="props-objects"
                    value={selectedPropObject}
                    onChange={(e) => handleAdvancedSettingChange(setSelectedPropObject, e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                    dir="rtl"
                    aria-label="انتخاب اشیای همراه در صحنه"
                  >
                    {promptData.propsObjects.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

              </div> {/* End Advanced Prompt Settings */}
            </>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 text-center text-gray-500">
              در حال بارگذاری گزینه‌های پرامپت...
            </div>
          )}

        </div>

        {/* Image Display & Save Button - Left Column (in RTL layout) */}
        <div className="lg:w-2/3 flex flex-col gap-6 order-1 lg:order-2"> {/* Changed to flex-col here */}
          <div className="flex flex-col gap-6"> {/* Parent div for image displays, ensures vertical stacking */}
            {MemoizedImageDisplays}
          </div>

          {enhancedImage && !isLoading && (
            <div className="flex justify-center">
              <button
                onClick={handleSaveImage}
                className="bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center"
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

      <footer className="text-center text-gray-500 mt-auto p-4" dir="rtl">
        قدرت گرفته از Gemini API | توسعه داده شده توسط Amin Naseri Karimvand akarimvand@gmail.com +۹۸۹۳۶۶۳۰۲۸۰۰
      </footer>

      {showImageModal && currentModalImage && currentModalImageTitle && (
        <ImageModal
          src={currentModalImage}
          alt={currentModalImageTitle}
          title={currentModalImageTitle}
          onClose={closeImageModal}
        />
      )}

      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
    </div>
  );
};

export default App;
