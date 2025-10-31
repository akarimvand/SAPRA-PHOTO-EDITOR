
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
          <h3 className="text-xl font-semibold mb-2 text-blue-700">۱. آپلود تصویر:</h3>
          <p className="mb-2">برای شروع، روی دکمه <span className="font-bold text-blue-600">"آپلود تصویر"</span> کلیک کنید و یک فایل تصویری (JPEG, PNG و غیره) را از دستگاه خود انتخاب نمایید. تصویر انتخاب شده در پنل <span className="font-bold">"تصویر اصلی"</span> نمایش داده خواهد شد.</p>
          <p className="mb-2">جهت گرفتن بهترین نتیجه، یک تصویر با وضوح مناسب و نورپردازی متعادل آپلود کنید.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">۲. انتخاب پرامپت‌ها و تنظیمات:</h3>
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
                <li><span className="font-bold">شدت بهبود:</span> با استفاده از این اسلایدر، میزان کلی تأثیر هوش مصنوعی بر تصویر را تنظیم کنید. مقادیر بالاتر به تغییرات دراماتیک‌تر و مقادیر پایین‌تر به بهبودهای ظریف‌تر منجر می‌شود.</li>
                <li><span className="font-bold">نوع عکس (تک نفره/دسته جمعی):</span> مشخص کنید که عکس "تک نفره" است یا "دسته جمعی". این به مدل کمک می‌کند تا هنگام ویرایش، هویت همه چهره‌ها را با دقت بیشتری حفظ کند و کیفیت تصویر برای تعداد افراد مختلف بهینه شود. در حالت "دسته جمعی"، مدل نهایت تلاش خود را می‌کند تا اصالت و ویژگی‌های منحصر به فرد هر یک از افراد را با دقت بسیار بالا حفظ کند.</li>
                <li><span className="font-bold">گروه سنی:</span> "بزرگسال" یا "کودک" را انتخاب کنید. این گزینه، گزینه‌های لباس را فیلتر می‌کند.</li>
                <li><span className="font-bold">جنسیت:</span> "مرد" یا "زن" را انتخاب کنید. این گزینه نیز بر فیلترینگ لباس‌ها تاثیر می‌گذارد.</li>
                <li><span className="font-bold">حالت چهره:</span> حالت چهره سوژه را انتخاب کنید (مثلاً "لبخند گرم", "متفکر").</li>
                <li><span className="font-bold">مدل مو:</span> مدل مو را برای سوژه تنظیم کنید (مثلاً "موهای بلند مواج", "باب کوتاه").</li>
                <li><span className="font-bold">آرایش:</span> سبک آرایش را انتخاب کنید (مثلاً "آرایش طبیعی", "چشم دودی دراماتیک").</li>
                <li><span className="font-bold">اکسسوری:</span> اکسسوری‌های مورد نظر را اضافه کنید (مثلاً "جواهرات ظریف طلا", "کلاه شیک").</li>
                <li><span className="font-bold">کادربندی و برش:</span> نمای دوربین را مشخص کنید (مانند "تمام قد"، "چهره بسته").</li>
                <li><span className="font-bold">لباس و لوازم جانبی:</span> نوع لباس را بر اساس جنسیت و گروه سنی انتخاب کنید.</li>
                <li><span className="font-bold">پس‌زمینه و محیط:</span> محیط پس‌زمینه را تغییر دهید (مانند "ساحل"، "کوه برفی").
                </li>
                <li><span className="font-bold">نورپردازی و اتمسفر:</span> حالت و نوع نورپردازی را انتخاب کنید (مانلاً "نور گرم طلایی"، "نورپردازی رامبراند").</li>
                <li><span className="font-bold">دوربین و تنظیمات:</span> نوع دوربین و لنز مورد استفاده را شبیه‌سازی کنید.</li>
                <li><span className="font-bold">نکات سبک و استایل:</span> سبک کلی هنری تصویر را تعیین کنید (مانند "سینمایی و رویایی"، "پانک راک").</li>
                <li><span className="font-bold">اشیای همراه در صحنه:</span> اشیای اضافی را به صحنه اضافه کنید (مثلاً "کنار خودروی کلاسیک"، "مجسمه باستانی ایرانی").</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">۳. بهبود تصویر:</h3>
          <p className="mb-2">پس از انتخاب همه گزینه‌های مورد نظر، روی دکمه <span className="font-bold text-emerald-600">"بهبود تصویر"</span> کلیک کنید. هوش مصنوعی شروع به پردازش تصویر و ایجاد پرتره بهبود یافته شما خواهد کرد. این فرآیند ممکن است چند لحظه طول بکشد.</p>
          <p className="mb-2">تصویر بهبود یافته در پنل <span className="font-bold">"تصویر بهبود یافته"</span> نمایش داده می‌شود. شما می‌توانید با کلیک بر روی هر یک از تصاویر (اصلی یا بهبود یافته)، آن را در اندازه بزرگتر مشاهده کنید.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">۴. ذخیره تصویر:</h3>
          <p className="mb-2">هنگامی که تصویر بهبود یافته نمایش داده شد، می‌توانید روی دکمه <span className="font-bold text-purple-600">"ذخیره تصویر بهبود یافته"</span> کلیک کنید تا تصویر نهایی را در دستگاه خود ذخیره نمایید.</p>
          <p className="mb-2">سریال تنظیمات پرامپت نیز به نام فایل اضافه می‌شود. می‌توانید این سریال را کپی کرده و بعداً در بخش <span className="font-bold text-gray-600">"بارگذاری تنظیمات"</span> وارد کنید تا به طور خودکار گزینه‌های پرامپت شما بازیابی شوند.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">۵. ذخیره پرامپت:</h3>
          <p className="mb-2">برای ذخیره کردن پرامپت نهایی (ترکیبی از انتخاب‌های شما و ورودی‌های سفارشی) که به مدل ارسال شده است، روی دکمه <span className="font-bold text-gray-600">"ذخیره پرامپت"</span> کلیک کنید تا در یک فایل متنی ذخیره شود. این می‌تواند برای استفاده مجدد از تنظیمات خاص مفید باشد.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">۶. بارگذاری تنظیمات:</h3>
          <p className="mb-2">اگر یک <span className="font-bold text-gray-600">"سریال تنظیمات"</span> از تصویر قبلی دارید، آن را در فیلد مربوطه وارد کرده و روی دکمه <span className="font-bold text-blue-600">"بارگذاری تنظیمات"</span> کلیک کنید تا به طور خودکار تمام انتخاب‌های پرامپت (از جمله پرامپت سفارشی و شدت بهبود) بازیابی شوند.</p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 text-blue-700">۷. نکات مهم:</h3>
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

// Custom Before/After Slider Component
interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  onOpenModal: (src: string, title: string) => void;
  isLoading: boolean;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeSrc, afterSrc, onOpenModal, isLoading }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    let newPosition = ((e.clientX - left) / width) * 100;
    newPosition = Math.max(0, Math.min(100, newPosition)); // Clamp between 0 and 100
    setSliderPosition(newPosition);
    e.preventDefault(); // Prevent text selection/default dragging
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag if clicking on the handle itself, not images
    const target = e.target as HTMLElement;
    if (target.closest('.slider-handle')) {
      setIsDragging(true);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      e.preventDefault(); // Prevent default browser drag behavior
    }
  }, [handleMouseMove, handleMouseUp]);

  // Handle touch events
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !containerRef.current || !e.touches[0]) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    let newPosition = ((e.touches[0].clientX - left) / width) * 100;
    newPosition = Math.max(0, Math.min(100, newPosition));
    setSliderPosition(newPosition);
    e.preventDefault(); // Prevent scrolling
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only drag if touching on the handle itself
    const target = e.target as HTMLElement;
    if (target.closest('.slider-handle')) {
      setIsDragging(true);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      e.preventDefault(); // Prevent default touch behavior
    }
  }, [handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    if (!isDragging) {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);


  return (
    <div className="relative w-full h-[400px] md:h-[500px] max-h-[600px] bg-gray-100 rounded-md overflow-hidden border-2 border-gray-300 flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center text-blue-600">
          <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>در حال بهبود...</span>
        </div>
      ) : (
        <div ref={containerRef} className="relative w-full h-full flex">
          <div
            className="absolute inset-0 z-0"
            onClick={() => onOpenModal(beforeSrc, "تصویر اصلی")}
            role="button"
            tabIndex={0}
            aria-label="نمایش تصویر اصلی بزرگتر"
          >
            <img src={beforeSrc} alt="Original" className="w-full h-full object-contain pointer-events-none" />
          </div>
          <div
            className="absolute inset-0 overflow-hidden z-10"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            onClick={() => onOpenModal(afterSrc, "تصویر بهبود یافته")}
            role="button"
            tabIndex={0}
            aria-label="نمایش تصویر بهبود یافته بزرگتر"
          >
            <img src={afterSrc} alt="Enhanced" className="w-full h-full object-contain pointer-events-none" />
          </div>
          <div
            className="absolute top-0 bottom-0 w-1 bg-white border-l border-r border-gray-400 cursor-ew-resize z-20 slider-handle"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            role="slider"
            aria-valuenow={sliderPosition}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="تنظیم مقایسه تصویر"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
              </svg>
            </div>
          </div>
          {/* Labels for Before/After */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md z-30" dir="rtl">اصلی</div>
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md z-30" dir="rtl">بهبود یافته</div>
        </div>
      )}
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
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string>(''); // To store the last prompt sent to API
  const [serialInput, setSerialInput] = useState<string>('');
  
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
  // New fields
  const [selectedHairStyle, setSelectedHairStyle] = useState<string>('');
  const [selectedMakeup, setSelectedMakeup] = useState<string>('');
  const [selectedAccessory, setSelectedAccessory] = useState<string>('');
  const [selectedFacialExpression, setSelectedFacialExpression] = useState<string>('');
  // New state for enhancement intensity
  const [enhancementIntensity, setEnhancementIntensity] = useState<number>(75);


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
          lighting, cameras, styles, propsObjects, photoSubject,
          hairStyles, makeup, accessories, facialExpressions 
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
          fetch('/data/photoSubject.json').then(res => res.json()),
          fetch('/data/hairStyles.json').then(res => res.json()),
          fetch('/data/makeup.json').then(res => res.json()),
          fetch('/data/accessories.json').then(res => res.json()),
          fetch('/data/facialExpressions.json').then(res => res.json()),
        ]);
        setPromptData({
          presets, framing, gender, ageGroup, clothing, backgrounds,
          lighting, cameras, styles, propsObjects, photoSubject,
          hairStyles, makeup, accessories, facialExpressions
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
        // Set initial states for new categories
        setSelectedHairStyle(hairStyles[0]?.value || '');
        setSelectedMakeup(makeup[0]?.value || '');
        setSelectedAccessory(accessories[0]?.value || '');
        setSelectedFacialExpression(facialExpressions[0]?.value || '');

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

    // Filter by age group
    if (selectedAgeGroup === 'child') {
      options = options.filter(item => item.gender === 'child' || item.gender === 'unisex' || item.value === '');
    } else if (selectedAgeGroup === 'adult') {
      options = options.filter(item => item.gender !== 'child' || item.value === '');
    }
    // If no age group selected, show all adult-appropriate options and unisex, and child options as well if selectedAgeGroup is empty.

    // Filter by gender, only if age group is not 'child' OR if gender is specifically 'unisex'
    if (selectedAgeGroup !== 'child') {
      if (selectedGender === 'male') {
        options = options.filter(item => item.gender === 'male' || item.gender === 'unisex' || item.value === '');
      } else if (selectedGender === 'female') {
        options = options.filter(item => item.gender === 'female' || item.gender === 'unisex' || item.value === '');
      }
    }


    // Ensure the default empty option is always available
    const defaultOption = promptData.clothing.find(item => item.value === '');
    if (defaultOption && !options.some(item => item.value === '')) {
      options = [defaultOption, ...options];
    }
    // Remove duplicates
    return Array.from(new Map(options.map(item => [item.value, item])).values());
  }, [promptData, selectedGender, selectedAgeGroup]);

  // Filter props/objects based on selected background
  const filteredPropsObjects = useMemo(() => {
    if (!promptData) return [];

    let options = promptData.propsObjects;

    const defaultEmptyOption = options.find(item => item.value === '');
    const generalOptions = options.filter(item => !item.tags); // Props without specific tags are always general

    if (selectedBackground) {
      const selectedBgOption = promptData.backgrounds.find(bg => bg.value === selectedBackground);
      if (selectedBgOption && selectedBgOption.tags && selectedBgOption.tags.length > 0) {
        const compatibleOptions = options.filter(prop => 
          prop.tags && prop.tags.some(tag => selectedBgOption.tags?.includes(tag))
        );
        options = [...generalOptions, ...compatibleOptions];
      } else {
        // If selected background has no specific tags, show all general props
        options = promptData.propsObjects;
      }
    } else {
      // No background selected, show all props (including defaults and general ones)
      options = promptData.propsObjects;
    }

    // Fix: Changed 'defaultOption' to 'defaultEmptyOption'
    // Ensure default empty option is always included and unique
    if (defaultEmptyOption && !options.some(item => item.value === '')) {
      options = [defaultEmptyOption, ...options]; 
    }
    return Array.from(new Map(options.map(item => [item.value, item])).values());
  }, [promptData, selectedBackground]);


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
      promptSegments.push(`Create a photorealistic portrait of all individuals in the uploaded image. Ensure the unique identity and individual facial features of *each* person are preserved with utmost fidelity and absolute accuracy. Enhance the image quality significantly, remove all scratches, tears, and imperfections. Transform it into a high-quality, professional studio portrait with natural color correction.`);
    } else { // Default or 'single'
      promptSegments.push(`Create a photorealistic portrait of the person in the uploaded image. Ensure the identity and facial features are preserved with absolute accuracy. Enhance the image quality significantly, remove all scratches, tears, and imperfections. Transform it into a high-quality, professional studio portrait with natural color correction.`);
    }

    // Add enhancement intensity
    promptSegments.push(`Apply enhancements with an intensity level of ${enhancementIntensity}%.`);

    // 2. Add selected preset if not "No preset"
    if (selectedPreset) {
      promptSegments.push(selectedPreset);
    }

    // 3. Subject & Composition Details
    let subjectDescription = "";
    if (selectedAgeGroup === 'child') {
        subjectDescription += "a young ";
        if (selectedGender === 'male') subjectDescription += "boy ";
        else if (selectedGender === 'female') subjectDescription += "girl ";
        else subjectDescription += "child ";
    } else if (selectedAgeGroup === 'adult') {
        subjectDescription += "an adult ";
        if (selectedGender === 'male') subjectDescription += "man ";
        else if (selectedGender === 'female') subjectDescription += "woman ";
        else subjectDescription += "individual ";
    } else { // Default age group, but gender might be selected
        if (selectedGender === 'male') subjectDescription += "a male individual ";
        else if (selectedGender === 'female') subjectDescription += "a female individual ";
    }
    if (subjectDescription && selectedPhotoSubject !== 'group') {
        promptSegments.push(`Subject is ${subjectDescription.trim()}.`);
    }

    if (selectedFraming) {
      promptSegments.push(`Framing: ${selectedFraming}.`);
    }
    if (selectedFacialExpression) { // New
      promptSegments.push(`With a ${selectedFacialExpression} expression.`);
    }

    // 4. Attire & Accessories
    if (selectedClothing) {
      promptSegments.push(`Wearing ${selectedClothing}.`);
    }
    if (selectedAccessory) { // New
      promptSegments.push(`Accessories include: ${selectedAccessory}.`);
    }

    // 5. Personal Features (Hair & Makeup)
    if (selectedHairStyle) { // New
      promptSegments.push(`Hair styled as ${selectedHairStyle}.`);
    }
    if (selectedMakeup) { // New
      promptSegments.push(`Makeup style: ${selectedMakeup}.`);
    }
    
    // 6. Environment & Scene
    if (selectedBackground) {
      promptSegments.push(`Background and environment: ${selectedBackground}.`);
    }
    if (selectedPropObject) {
      promptSegments.push(`Include in the scene: ${selectedPropObject}.`);
    }

    // 7. Technical & Artistic Details
    if (selectedLighting) {
      promptSegments.push(`Lighting and atmosphere: ${selectedLighting}.`);
    }
    if (selectedCamera) {
      promptSegments.push(`Camera and settings: ${selectedCamera}.`);
    }
    if (selectedStyle) {
      promptSegments.push(`Style notes: ${selectedStyle}.`);
    }
    
    // 8. Finally, add any custom prompt text for granular details
    if (customPrompt.trim()) {
      promptSegments.push(`Additional specific details and modifications: "${customPrompt.trim()}".`);
    }

    const finalPrompt = promptSegments.join(' ');
    console.log("Final Prompt:", finalPrompt); // For debugging purposes
    setLastGeneratedPrompt(finalPrompt); // Store the generated prompt

    try {
      const result = await enhanceImage(selectedImage, finalPrompt);
      setEnhancedImage(result);
    } catch (err: any) {
      console.error("خطا در بهبود تصویر:", err);
      setError(`خطا در بهبود تصویر: ${err.message || 'خطای ناشناخته'}`);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedImage, promptData, selectedPreset, selectedClothing, selectedBackground,
    selectedLighting, selectedCamera, selectedStyle, selectedFraming, selectedGender,
    selectedAgeGroup, selectedPropObject, customPrompt, selectedPhotoSubject,
    selectedHairStyle, selectedMakeup, selectedAccessory, selectedFacialExpression,
    enhancementIntensity
  ]);

  const generateSettingsSerial = useCallback(() => {
    const SEPARATOR = '_SEP_'; // Unique separator
    const values = [
      'v1', // Version for future compatibility
      selectedPreset,
      customPrompt,
      enhancementIntensity.toString(),
      selectedPhotoSubject,
      selectedAgeGroup,
      selectedGender,
      selectedFacialExpression,
      selectedHairStyle,
      selectedMakeup,
      selectedAccessory,
      selectedFraming,
      selectedClothing,
      selectedBackground,
      selectedPropObject,
      selectedLighting,
      selectedCamera,
      selectedStyle,
    ].map(item => encodeURIComponent(item || '')); // Ensure all items are strings and URL-encoded

    return btoa(values.join(SEPARATOR)); // Base64 encode the whole string
  }, [
    selectedPreset, customPrompt, enhancementIntensity, selectedPhotoSubject,
    selectedAgeGroup, selectedGender, selectedFacialExpression, selectedHairStyle,
    selectedMakeup, selectedAccessory, selectedFraming, selectedClothing,
    selectedBackground, selectedPropObject, selectedLighting, selectedCamera, selectedStyle
  ]);

  const handleSaveImage = () => {
    if (enhancedImage) {
      const serial = generateSettingsSerial();
      const link = document.createElement('a');
      link.href = enhancedImage;
      link.download = `تصویر_بهبود_یافته_SAPRA_${serial}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setError("تصویر بهبود یافته‌ای برای ذخیره وجود ندارد.");
    }
  };

  const handleSavePromptToFile = () => {
    if (lastGeneratedPrompt) {
      const blob = new Blob([lastGeneratedPrompt], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'prompt_SAPRA.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setError("پرامپت در فایل متنی ذخیره شد!");
      setTimeout(() => setError(null), 3000);
    } else {
      setError("پرامپتی برای ذخیره کردن وجود ندارد. ابتدا تصویر را بهبود بخشید.");
    }
  };

  const handleResetSelections = useCallback(() => {
    if (!promptData) return; // Prevent resetting if data isn't loaded yet

    setSelectedPreset(promptData.presets[0]?.value || ''); 
    setSelectedClothing(promptData.clothing[0]?.value || '');
    setSelectedBackground(promptData.backgrounds[0]?.value || '');
    setSelectedLighting(promptData.lighting[0]?.value || '');
    setSelectedCamera(promptData.cameras[0]?.value || '');
    setSelectedStyle(promptData.styles[0]?.value || '');
    setSelectedFraming(promptData.framing[0]?.value || '');
    setSelectedGender(promptData.gender[0]?.value || '');
    setSelectedAgeGroup(promptData.ageGroup[0]?.value || '');
    setSelectedPropObject(promptData.propsObjects[0]?.value || '');
    setSelectedPhotoSubject(promptData.photoSubject[0]?.value || '');
    setSelectedHairStyle(promptData.hairStyles[0]?.value || '');
    setSelectedMakeup(promptData.makeup[0]?.value || '');
    setSelectedAccessory(promptData.accessories[0]?.value || '');
    setSelectedFacialExpression(promptData.facialExpressions[0]?.value || '');
    setEnhancementIntensity(75); // Reset to default intensity
    setCustomPrompt('');
    setSerialInput(''); // Clear serial input field
    setError("انتخاب‌ها بازنشانی شدند.");
    setTimeout(() => setError(null), 3000);
  }, [promptData]);

  const applySettingsSerial = useCallback((serialString: string) => {
    if (!serialString.trim()) {
      setError("سریال تنظیمات خالی است.");
      return;
    }
    if (!promptData) {
      setError("داده‌های پرامپت هنوز بارگذاری نشده‌اند. لطفا صبر کنید.");
      return;
    }

    try {
      const decodedString = decodeURIComponent(atob(serialString));
      const SEPARATOR = '_SEP_';
      const values = decodedString.split(SEPARATOR);

      if (values.length !== 18 || values[0] !== 'v1') { // 18 items for v1
        setError("سریال تنظیمات نامعتبر است یا فرمت آن قدیمی است.");
        return;
      }
      
      const [,
        preset, customP, intensity, photoSubject, ageGroup, gender,
        facialExpression, hairStyle, makeup, accessory, framing,
        clothing, background, propObject, lighting, camera, style
      ] = values;

      // Update states, checking if the value exists in the current promptData
      const findOptionValue = (options: PromptOption[] | ClothingOption[], val: string) => 
        options.some(opt => opt.value === val) ? val : options[0]?.value || '';

      setSelectedPreset(findOptionValue(promptData.presets, preset));
      setCustomPrompt(customP);
      setEnhancementIntensity(Math.max(0, Math.min(100, Number(intensity) || 75))); // Clamp and default
      setSelectedPhotoSubject(findOptionValue(promptData.photoSubject, photoSubject));
      setSelectedAgeGroup(findOptionValue(promptData.ageGroup, ageGroup));
      setSelectedGender(findOptionValue(promptData.gender, gender));
      setSelectedFacialExpression(findOptionValue(promptData.facialExpressions, facialExpression));
      setSelectedHairStyle(findOptionValue(promptData.hairStyles, hairStyle));
      setSelectedMakeup(findOptionValue(promptData.makeup, makeup));
      setSelectedAccessory(findOptionValue(promptData.accessories, accessory));
      setSelectedFraming(findOptionValue(promptData.framing, framing));
      setSelectedClothing(findOptionValue(promptData.clothing, clothing));
      setSelectedBackground(findOptionValue(promptData.backgrounds, background));
      setSelectedPropObject(findOptionValue(promptData.propsObjects, propObject));
      setSelectedLighting(findOptionValue(promptData.lighting, lighting));
      setSelectedCamera(findOptionValue(promptData.cameras, camera));
      setSelectedStyle(findOptionValue(promptData.styles, style));

      setError("تنظیمات با موفقیت بارگذاری شد!");
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error("خطا در بارگذاری سریال:", err);
      setError("خطا در بارگذاری سریال تنظیمات. ممکن است سریال نامعتبر باشد.");
    }
  }, [promptData]);

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

  const MemoizedImageDisplays = useMemo(() => {
    // Determine if both images are present to activate the slider
    const showSlider = selectedImage && enhancedImage && !isLoading;

    return (
      <div className="w-full max-w-full bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-4 border border-gray-200 max-h-[80vh]">
        {showSlider ? (
          <BeforeAfterSlider
            beforeSrc={selectedImage!}
            afterSrc={enhancedImage!}
            onOpenModal={openImageModal}
            isLoading={isLoading}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Original Image Display */}
            <div className="flex flex-col items-center justify-center w-full">
              <h2 className="text-xl font-semibold mb-3 text-center text-gray-800" dir="rtl">تصویر اصلی</h2>
              <div 
                className="flex items-center justify-center w-full aspect-video md:aspect-square max-h-[400px] md:max-h-[500px] bg-gray-100 rounded-md overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors duration-200 p-4"
                onClick={() => selectedImage && openImageModal(selectedImage, "تصویر اصلی")}
                role="button"
                tabIndex={0}
                aria-label="نمایش تصویر اصلی بزرگتر"
              >
                {selectedImage ? (
                  <img src={selectedImage} alt="Selected" className="max-h-full max-w-full object-contain" />
                ) : (
                  <p className="text-gray-500 text-center p-4">یک تصویر آپلود کنید تا اینجا ببینید.</p>
                )}
              </div>
            </div>

            {/* Enhanced Image Display */}
            <div className="flex flex-col items-center justify-center w-full">
              <h2 className="text-xl font-semibold mb-3 text-center text-gray-800" dir="rtl">تصویر بهبود یافته</h2>
              <div 
                className="flex items-center justify-center w-full aspect-video md:aspect-square max-h-[400px] md:max-h-[500px] bg-gray-100 rounded-md overflow-hidden border-2 border-gray-300 p-4"
                onClick={() => enhancedImage && !isLoading && openImageModal(enhancedImage, "تصویر بهبود یافته")}
                role="button"
                tabIndex={0}
                aria-label="نمایش تصویر بهبود یافته بزرگتر"
              >
                {isLoading ? (
                  <div className="flex flex-col items-center text-blue-600 p-4">
                    <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>در حال بهبود...</span>
                  </div>
                ) : enhancedImage ? (
                  <img src={enhancedImage} alt="Enhanced" className="max-h-full max-w-full object-contain cursor-pointer hover:border-blue-500 transition-colors duration-200" />
                ) : (
                  <p className="text-gray-500 text-center p-4">تصویر بهبود یافته شما اینجا ظاهر می‌شود.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [selectedImage, isLoading, enhancedImage, openImageModal]);


  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col w-full">
      {/* Header */}
      <header className="w-full bg-white shadow-lg p-4 flex justify-between items-center z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-sm font-sans text-gray-900 mr-4">
          SAPRA PHOTO ENHANCER
        </h1>
        <button
          onClick={() => setShowHelpModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow-md flex items-center whitespace-nowrap"
          dir="rtl"
          aria-label="راهنما"
        >
          <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5L6 11H5a1 1 0 000 2h1a1 1 0 00.867.5l2-3.5 2 3.5A1 1 0 0013 13h1a1 1 0 100-2h-1l-2-3.5a1 1 0 00-.867-.5z" clipRule="evenodd"></path></svg>
          راهنما
        </button>
      </header>

      {/* Main Content Area (Sidebar + Main View) */}
      <div className="flex flex-1 flex-col lg:flex-row w-full p-4 gap-4">

        {/* Main View - Images and primary actions */}
        <main className="flex-1 bg-white rounded-xl shadow-xl p-6 flex flex-col gap-6 order-2 lg:order-1"> {/* order for responsive stacking */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label htmlFor="image-upload" className="flex-1 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md" dir="rtl" aria-label="آپلود تصویر">
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
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            <div className={`bg-${error.includes('با موفقیت') || error.includes('ذخیره شد') ? 'green-100 text-green-700' : 'red-100 text-red-700'} p-4 rounded-lg text-center shadow-md border ${error.includes('با موفقیت') || error.includes('ذخیره شد') ? 'border-green-300' : 'border-red-300'}`} role="alert" dir="rtl">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {MemoizedImageDisplays}

          {enhancedImage && !isLoading && (
            <div className="flex flex-col sm:flex-row gap-4 mt-auto"> {/* Use mt-auto to push to bottom */}
              <button
                onClick={handleSaveImage}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center"
                dir="rtl"
                aria-label="ذخیره تصویر بهبود یافته"
              >
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                ذخیره تصویر بهبود یافته
              </button>
              <button
                onClick={handleSavePromptToFile}
                disabled={!lastGeneratedPrompt}
                className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                dir="rtl"
                aria-label="ذخیره پرامپت تولید شده در فایل"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                ذخیره پرامپت
              </button>
            </div>
          )}
        </main>

        {/* Sidebar - All Controls */}
        <aside className="w-full lg:w-1/3 xl:w-1/4 bg-white rounded-xl shadow-xl p-6 flex flex-col gap-6 order-1 lg:order-2 overflow-y-auto max-h-[calc(100vh-8rem)] lg:max-h-full"> {/* order for responsive stacking, max-h to enable scroll */}
          <button
              onClick={handleResetSelections}
              disabled={!promptData}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
              dir="rtl"
              aria-label="بازنشانی همه انتخاب‌ها"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12c0 4.418 3.582 8 8 8s8-3.582 8-8S16.418 4 12 4c-1.112 0-2.164.246-3.117.68M4 12H1m19 0h3"></path></svg>
              بازنشانی انتخاب‌ها
            </button>
          {/* Load Settings from Serial */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200">
            <label htmlFor="load-serial" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
              بارگذاری تنظیمات با سریال:
            </label>
            <div className="flex gap-2">
              <input
                id="load-serial"
                type="text"
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                placeholder="سریال تنظیمات را اینجا وارد کنید..."
                dir="ltr" // Serial is typically LTR
                aria-label="فیلد ورود سریال تنظیمات"
              />
              <button
                onClick={() => applySettingsSerial(serialInput)}
                disabled={!serialInput.trim() || !promptData}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                dir="rtl"
                aria-label="بارگذاری تنظیمات"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                بارگذاری
              </button>
            </div>
          </div>

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
              <div className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 flex flex-col gap-6">
                <h3 className="text-gray-700 text-lg font-bold mb-0" dir="rtl">تنظیمات پیشرفته پرامپت:</h3>
                
                {/* Enhancement Intensity Slider */}
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <label htmlFor="enhancement-intensity" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                    شدت بهبود: <span className="text-blue-600 font-semibold">{enhancementIntensity}%</span>
                  </label>
                  <input
                    id="enhancement-intensity"
                    type="range"
                    min="0"
                    max="100"
                    value={enhancementIntensity}
                    onChange={(e) => setEnhancementIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="ltr" // Range input is usually LTR visually
                    aria-label="تنظیم شدت بهبود تصویر"
                  />
                </div>

                {/* Subject & Composition Settings */}
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <h4 className="text-gray-800 text-md font-bold mb-3" dir="rtl">تنظیمات سوژه و ترکیب‌بندی:</h4>
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
                  
                  {/* Facial Expression (New) */}
                  <div className="mb-4">
                    <label htmlFor="facial-expression" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                      حالت چهره:
                    </label>
                    <select
                      id="facial-expression"
                      value={selectedFacialExpression}
                      onChange={(e) => handleAdvancedSettingChange(setSelectedFacialExpression, e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                      dir="rtl"
                      aria-label="انتخاب حالت چهره"
                    >
                      {promptData.facialExpressions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hair Style (New) */}
                  <div className="mb-4">
                    <label htmlFor="hair-style" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                      مدل مو:
                    </label>
                    <select
                      id="hair-style"
                      value={selectedHairStyle}
                      onChange={(e) => handleAdvancedSettingChange(setSelectedHairStyle, e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                      dir="rtl"
                      aria-label="انتخاب مدل مو"
                    >
                      {promptData.hairStyles.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Makeup (New) */}
                  <div className="mb-4">
                    <label htmlFor="makeup" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                      آرایش:
                    </label>
                    <select
                      id="makeup"
                      value={selectedMakeup}
                      onChange={(e) => handleAdvancedSettingChange(setSelectedMakeup, e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                      dir="rtl"
                      aria-label="انتخاب سبک آرایش"
                    >
                      {promptData.makeup.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Accessories (New) */}
                  <div className="mb-4">
                    <label htmlFor="accessories" className="block text-gray-700 text-sm font-bold mb-2" dir="rtl">
                      اکسسوری:
                    </label>
                    <select
                      id="accessories"
                      value={selectedAccessory}
                      onChange={(e) => handleAdvancedSettingChange(setSelectedAccessory, e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
                      dir="rtl"
                      aria-label="انتخاب اکسسوری"
                    >
                      {promptData.accessories.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Framing & Crop */}
                  <div className="mb-0"> {/* Last item in section, no bottom margin */}
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
                </div> {/* End Subject & Composition Settings */}

                {/* Environment & Visual Style */}
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <h4 className="text-gray-800 text-md font-bold mb-3" dir="rtl">محیط و استایل بصری:</h4>
                
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

                  {/* Props / Objects */}
                  <div className="mb-4">
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
                      {filteredPropsObjects.map((option) => (
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
                  <div className="mb-0"> {/* Last item in section, no bottom margin */}
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
                </div> {/* End Environment & Visual Style */}

              </div> {/* End Advanced Prompt Settings */}
            </>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 text-center text-gray-500">
              در حال بارگذاری گزینه‌های پرامپت...
            </div>
          )}

        </aside>
      </div>

      <footer className="text-center text-gray-500 mt-auto p-4 w-full" dir="rtl">
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