# مستندات کامل برنامه SAPRA PHOTO ENHANCER

این سند به تفصیل معماری، رابط کاربری، منطق تولید پرامپت، تعامل با API و ساختار داده‌های برنامه SAPRA PHOTO ENHANCER را توضیح می‌دهد.

## ۱. مقدمه

**SAPRA PHOTO ENHANCER** یک ابزار قدرتمند مبتنی بر هوش مصنوعی است که برای بازسازی و بهبود تصاویر موجود، به پرتره‌های استودیویی با کیفیت بالا طراحی شده است. این برنامه قابلیت تصحیح رنگ، حذف نواقص و ارائه گزینه‌های سفارشی‌سازی گسترده برای کادربندی، جنسیت، سن، لباس، نورپردازی، پس‌زمینه و موارد دیگر را دارد. هدف اصلی این برنامه، حفظ هویت چهره در تصویر اصلی در عین حال تبدیل آن به یک اثر هنری با کیفیت استودیویی است. این برنامه توسط Amin Naseri Karimvand توسعه یافته است.

## ۲. ساختار فایل‌ها

ساختار پروژه به صورت ماژولار و قابل نگهداری طراحی شده است:

*   **`index.html`**: فایل HTML اصلی و نقطه ورود برنامه.
*   **`index.tsx`**: نقطه ورود React که کامپوننت `App` را در DOM رندر می‌کند.
*   **`App.tsx`**: کامپوننت اصلی React که شامل تمام منطق رابط کاربری، مدیریت حالت و تعامل با سرویس‌ها است.
*   **`types.ts`**: فایل تعریف تایپ‌های TypeScript برای ساختارهای داده‌ای استفاده شده در برنامه.
*   **`services/geminiService.ts`**: حاوی توابع مربوط به تعامل با Google Gemini API.
*   **`public/data/*.json`**: مجموعه‌ای از فایل‌های JSON که گزینه‌های مختلف برای ساخت پرامپت را ذخیره می‌کنند (مانند `presets.json`, `clothing.json`, `backgrounds.json` و غیره).
*   **`metadata.json`**: فایل متادیتای برنامه که شامل نام، توضیحات و مجوزهای مورد نیاز فریم‌ورک است.

## ۳. کامپوننت اصلی (`App.tsx`)

`App.tsx` قلب برنامه است که تمامی منطق UI، مدیریت وضعیت و هماهنگی با API را در خود جای داده است.

### ۳.۱. مدیریت حالت (State Management)

این کامپوننت از هوک `useState` برای مدیریت وضعیت‌های مختلف برنامه استفاده می‌کند:

*   `selectedImage`: تصویر آپلود شده کاربر به صورت Base64.
*   `enhancedImage`: تصویر بهبود یافته دریافت شده از API به صورت Base64.
*   `isLoading`: وضعیت بارگذاری (برای فراخوانی `enhanceImage`).
*   `isRefiningPrompt`: وضعیت بارگذاری (برای فراخوانی `refineUserPrompt`).
*   `error`: پیام‌های خطا یا موفقیت برای نمایش به کاربر.
*   `customPrompt`: متن ورودی سفارشی کاربر برای تغییرات.
*   `lastGeneratedPrompt`: آخرین پرامپت نهایی که به API ارسال شده است.
*   `serialInput`: ورودی کاربر برای سریال تنظیمات.
*   `promptData`: تمام گزینه‌های پرامپت بارگذاری شده از فایل‌های JSON.
*   `selectedPreset`, `selectedClothing`, `selectedBackground`, ...: وضعیت‌های انتخاب شده برای هر دسته از گزینه‌های پرامپت.
*   `enhancementIntensity`: شدت بهبود تصویر (۰ تا ۱۰۰ درصد).
*   `showImageModal`, `currentModalImage`, `currentModalImageTitle`: مدیریت نمایش مودال تصاویر بزرگتر.
*   `showHelpModal`: مدیریت نمایش مودال راهنما.

### ۳.۲. بارگذاری داده (Data Loading)

هوک `useEffect` در هنگام mount شدن کامپوننت، تمام فایل‌های JSON حاوی گزینه‌های پرامپت را از پوشه `public/data/` بارگذاری می‌کند. این داده‌ها در `promptData` ذخیره می‌شوند و به طور پیش‌فرض، اولین گزینه هر دسته انتخاب می‌شود تا از حالت خالی بودن جلوگیری شود.

```typescript
useEffect(() => {
  const loadData = async () => {
    // ... fetch all JSON files ...
    setPromptData({ /* ... combined data ... */ });
    // Set default selections
  };
  loadData();
}, []);
```

### ۳.۳. توابع هندلر (Event Handlers)

*   **`handleFileChange`**:
    *   هنگام آپلود یک فایل تصویری، آن را با استفاده از `fileToBase64` به Base64 تبدیل کرده و در `selectedImage` ذخیره می‌کند.
    *   تصویر بهبود یافته قبلی را پاک می‌کند.
*   **`handlePresetChange`**: مقدار `selectedPreset` را بر اساس انتخاب کاربر به روز می‌کند.
*   **`handleCustomPromptChange`**: مقدار `customPrompt` را به روز می‌کند.
*   **`handleAdvancedSettingChange`**: یک هندلر عمومی برای به روزرسانی `useState` هر یک از تنظیمات پیشرفته.
*   **`handleRefinePrompt`**:
    *   پرامپت سفارشی کاربر را با `refineUserPrompt` به سرویس Gemini ارسال می‌کند.
    *   پرامپت بهبود یافته را دریافت کرده و `customPrompt` را با آن جایگزین می‌کند.
    *   پیام‌های موفقیت/خطا را نمایش می‌دهد.
*   **`handleEnhanceClick`**: (منطق اصلی تولید پرامپت و فراخوانی API)
    *   **بررسی پیش‌نیازها**: مطمئن می‌شود که تصویر آپلود شده و داده‌های پرامپت بارگذاری شده‌اند.
    *   **ساخت پرامپت نهایی**: این مهم‌ترین بخش است و با دقت مراحل زیر را طی می‌کند:
        1.  **حفظ هویت و کیفیت اصلی (Core Identity & Quality Preservation)**: این بخش همیشه در ابتدای پرامپت قرار می‌گیرد و تضمین می‌کند که هوش مصنوعی بر حفظ هویت چهره (به خصوص در حالت "دسته جمعی" که `selectedPhotoSubject` روی `group` تنظیم شده است)، افزایش کیفیت، حذف نواقص، و تصحیح رنگ طبیعی تمرکز کند.
            *   در حالت `group`: `Create a photorealistic portrait of all individuals in the uploaded image. Ensure the unique identity and individual facial features of *each* person are preserved with utmost fidelity and absolute accuracy. Enhance the image quality significantly, remove all scratches, tears, and imperfections. Transform it into a high-quality, professional studio portrait with natural color correction.`
            *   در حالت `single` یا پیش‌فرض: `Create a photorealistic portrait of the person in the uploaded image. Ensure the identity and facial features are preserved with absolute accuracy. Enhance the image quality significantly, remove all scratches, tears, and imperfections. Transform it into a high-quality, professional studio portrait with natural color correction.`
        2.  **شدت بهبود (`enhancementIntensity`)**: مقدار انتخاب شده از اسلایدر به پرامپت اضافه می‌شود: `Apply enhancements with an intensity level of ${enhancementIntensity}%.`
        3.  **پرامپت آماده (`selectedPreset`)**: اگر انتخاب شده باشد، به پرامپت اضافه می‌شود.
        4.  **جزئیات سوژه و ترکیب‌بندی**:
            *   `selectedAgeGroup` (گروه سنی) و `selectedGender` (جنسیت) برای ساخت یک توصیف کلی از سوژه (مثلاً "a young boy" یا "an adult woman") استفاده می‌شوند.
            *   `selectedFraming` (کادربندی)، `selectedFacialExpression` (حالت چهره) به پرامپت اضافه می‌شوند.
        5.  **لباس و اکسسوری**: `selectedClothing` و `selectedAccessory` اضافه می‌شوند.
        6.  **ویژگی‌های شخصی**: `selectedHairStyle` و `selectedMakeup` اضافه می‌شوند.
        7.  **محیط و صحنه**: `selectedBackground` و `selectedPropObject` اضافه می‌شوند.
        8.  **جزئیات فنی و هنری**: `selectedLighting`, `selectedCamera`, `selectedStyle` اضافه می‌شوند.
        9.  **پرامپت سفارشی (`customPrompt`)**: در نهایت، هر متن سفارشی که کاربر وارد کرده است، برای افزودن جزئیات دقیق‌تر به پرامپت اضافه می‌شود: `Additional specific details and modifications: "${customPrompt.trim()}".`
    *   **فراخوانی API**: پرامپت نهایی و تصویر Base64 به تابع `enhanceImage` ارسال می‌شوند.
    *   **نمایش نتایج**: تصویر بهبود یافته در `enhancedImage` ذخیره شده و نمایش داده می‌شود.
    *   **مدیریت خطا و بارگذاری**: وضعیت `isLoading` و `error` به روز می‌شوند.
*   **`handleSaveImage`**: تصویر بهبود یافته را به همراه یک نام فایل شامل سریال تنظیمات، دانلود می‌کند.
*   **`handleSavePromptToFile`**: `lastGeneratedPrompt` را در یک فایل متنی ذخیره می‌کند.
*   **`handleResetSelections`**: تمام گزینه‌های پرامپت و شدت بهبود را به مقادیر پیش‌فرض بازنشانی می‌کند.
*   **`applySettingsSerial`**: یک سریال تنظیمات Base64 (که قبلاً ذخیره شده است) را دریافت کرده، آن را دیکد می‌کند و تمام گزینه‌های پرامپت و شدت بهبود را بر اساس مقادیر موجود در سریال بازیابی می‌کند.
*   **`openImageModal`, `closeImageModal`**: توابعی برای باز و بسته کردن مودال نمایش تصاویر در اندازه بزرگتر.
*   **`setShowHelpModal`**: باز و بسته کردن مودال راهنما.

### ۳.۴. منطق فیلتر کردن گزینه‌ها (`useMemo`)

برای ارائه گزینه‌های مرتبط‌تر به کاربر، برخی از لیست‌های کشویی به صورت پویا فیلتر می‌شوند:

*   **`filteredClothingOptions`**:
    *   بر اساس `selectedAgeGroup` (کودک/بزرگسال) فیلتر می‌شود:
        *   اگر "کودک" انتخاب شده باشد، فقط لباس‌های با `gender: 'child'` یا `gender: 'unisex'` نمایش داده می‌شوند.
        *   اگر "بزرگسال" انتخاب شده باشد، لباس‌های با `gender: 'child'` حذف می‌شوند.
    *   سپس بر اساس `selectedGender` (مرد/زن) فیلتر می‌شود:
        *   اگر "مرد" انتخاب شده باشد، فقط لباس‌های با `gender: 'male'` یا `gender: 'unisex'` نمایش داده می‌شوند.
        *   اگر "زن" انتخاب شده باشد، فقط لباس‌های با `gender: 'female'` یا `gender: 'unisex'` نمایش داده می‌شوند.
    *   گزینه "پیش‌فرض (لباس موجود در تصویر)" همیشه در دسترس است.
*   **`filteredPropsObjects`**:
    *   بر اساس `selectedBackground` فیلتر می‌شود.
    *   هر گزینه `background` می‌تواند `tags` داشته باشد (مثلاً `["outdoor", "nature"]`).
    *   گزینه‌های `propObject` نیز `tags` دارند. اگر `background` انتخابی دارای تگ باشد، فقط `propsObjects` با تگ‌های مشترک یا `propsObjects` بدون تگ (عمومی) نمایش داده می‌شوند.
    *   اگر هیچ `background` انتخاب نشده باشد یا `background` انتخابی تگی نداشته باشد، تمام `propsObjects` نمایش داده می‌شوند.
    *   گزینه "پیش‌فرض (بدون شیء خاص)" همیشه در دسترس است.

### ۳.۵. سریالیزیشن و دسریالیزیشن تنظیمات

*   **`generateSettingsSerial`**:
    *   تمام مقادیر انتخاب شده برای پرامپت (از جمله شدت بهبود و پرامپت سفارشی) را در یک آرایه جمع‌آوری می‌کند.
    *   یک جداکننده منحصر به فرد (`_SEP_`) بین مقادیر قرار می‌دهد.
    *   هر مقدار را با `encodeURIComponent` کدگذاری می‌کند تا از مشکلات کاراکتری جلوگیری شود.
    *   رشته نهایی را با `btoa` به Base64 تبدیل می‌کند.
    *   نسخه‌بندی (`v1`) در ابتدای سریال برای سازگاری آینده گنجانده شده است.
*   **`applySettingsSerial`**:
    *   سریال Base64 را با `atob` دیکد می‌کند.
    *   `decodeURIComponent` را برای بازگرداندن کاراکترهای اصلی اعمال می‌کند.
    *   رشته را با جداکننده `_SEP_` به مقادیر اصلی تقسیم می‌کند.
    *   مقادیر را به ترتیب به متغیرهای حالت مربوطه اختصاص می‌دهد، با این اطمینان که مقدار بارگذاری شده در `promptData` موجود باشد تا از خطاهای احتمالی جلوگیری شود.

### ۳.۶. کامپوننت‌های فرعی

*   **`ImageModal`**:
    *   یک مودال ساده برای نمایش تصویر (اصلی یا بهبود یافته) در اندازه بزرگتر.
    *   دارای دکمه بستن و قابلیت بسته شدن با کلیک خارج از مودال.
    *   از ARIA attributes برای دسترسی‌پذیری استفاده می‌کند.
*   **`HelpModal`**:
    *   یک مودال حاوی راهنمای کامل استفاده از برنامه به زبان فارسی.
    *   توضیحات مفصلی در مورد هر بخش و ویژگی‌های برنامه ارائه می‌دهد.
    *   از ARIA attributes برای دسترسی‌پذیری استفاده می‌کند.
*   **`BeforeAfterSlider`**:
    *   یک کامپوننت جذاب برای مقایسه تصویر اصلی و بهبود یافته با استفاده از یک اسلایدر قابل حرکت.
    *   کاربر می‌تواند دستگیره اسلایدر را برای دیدن تفاوت بین دو تصویر به چپ و راست حرکت دهد.
    *   قابلیت کلیک روی هر بخش از تصویر برای باز کردن آن در `ImageModal`.
    *   مدیریت رویدادهای `mousedown`, `mousemove`, `mouseup` و `touchstart`, `touchmove`, `touchend` برای عملکرد روان روی دسکتاپ و موبایل.
    *   نشانگر بارگذاری (Spinner) در هنگام پردازش تصویر.
    *   از ARIA attributes برای دسترسی‌پذیری استفاده می‌کند.

### ۳.۷. UI/UX و رسپانسیو بودن

*   **Tailwind CSS**: برای استایل‌دهی سریع و رسپانسیو استفاده شده است.
*   **طراحی رسپانسیو**: با استفاده از کلاس‌های Tailwind (`flex-col lg:flex-row`, `w-full lg:w-1/3`, `md:max-h-[500px]`)، چیدمان برنامه به خوبی با اندازه‌های مختلف صفحه نمایش تطبیق پیدا می‌کند.
*   **فونت Vazirmatn**: برای تجربه کاربری بهتر با زبان فارسی.
*   **جهت‌گیری راست به چپ (RTL)**: تمام متن‌ها و چیدمان‌ها با `dir="rtl"` برای زبان فارسی بهینه شده‌اند.
*   **انیمیشن‌ها و ترنزیشن‌ها**: استفاده از کلاس‌های `transition-all duration-300 transform hover:scale-105` برای دکمه‌ها و عناصر تعاملی.
*   **اسلایدر مقایسه** (`BeforeAfterSlider`): یک راه بصری و جذاب برای مشاهده تغییرات.

## ۴. سرویس Gemini (`services/geminiService.ts`)

این فایل حاوی توابع سرویس است که با Google Gemini API ارتباط برقرار می‌کنند.

### ۴.۱. توابع کمکی

*   **`encode(bytes: Uint8Array): string`**: یک تابع کمکی برای تبدیل `Uint8Array` به رشته Base64. این تابع به صورت دستی پیاده‌سازی شده تا با الزامات @google/genai سازگار باشد و از کتابخانه‌های خارجی جلوگیری کند.
*   **`fileToBase64(file: File): Promise<string>`**: فایل `File` را دریافت کرده و آن را به رشته Base64 (همراه با پیشوند `data:mimeType;base64,`) تبدیل می‌کند.

### ۴.۲. `enhanceImage`

این تابع مسئول ارسال تصویر اصلی و پرامپت به مدل Gemini برای بهبود تصویر است.

```typescript
export const enhanceImage = async (base64ImageData: string, prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined...");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const [mimeType, data] = base64ImageData.split(';base64,');

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // مدل انتخاب شده برای ویرایش/تولید تصویر
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType.replace('data:', ''),
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE], // درخواست خروجی تصویر
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
```

*   **API Key**: از `process.env.API_KEY` برای امنیت و انعطاف‌پذیری استفاده می‌کند.
*   **مدل**: از `gemini-2.5-flash-image` که برای تولید و ویرایش عمومی تصاویر مناسب است، استفاده می‌شود.
*   **`contents`**: شامل دو بخش است: `inlineData` برای تصویر Base64 و `text` برای پرامپت متنی.
*   **`responseModalities`**: به صراحت `[Modality.IMAGE]` تنظیم شده تا از مدل، خروجی تصویری درخواست شود.
*   **استخراج خروجی**: تصویر بهبود یافته از `response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data` استخراج می‌شود.

### ۴.۳. `refineUserPrompt`

این تابع برای بهبود پرامپت‌های سفارشی کاربر با استفاده از هوش مصنوعی طراحی شده است.

```typescript
export const refineUserPrompt = async (userPrompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined...");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    شما یک مهندس پرامپت عکاسی پرتره حرفه‌ای هستید.
    وظیفه شما این است که یک درخواست ساده از کاربر را به یک پرامپت دقیق، کامل و موثر برای تولید و ویرایش تصویر پرتره تبدیل کنید.
    تمرکز اصلی شما بر گسترش جزئیات درخواست کاربر است، به گونه‌ای که با تنظیمات پیشرفته کلی تصویر (مانند نورپردازی و پس‌زمینه) همخوانی داشته باشد.
    هرگز اطلاعات مربوط به حفظ هویت چهره، کیفیت استودیویی، حذف نواقص یا تصحیح رنگ طبیعی را به پرامپت بهبود یافته اضافه نکنید، زیرا این موارد به صورت خودکار به پرامپت اصلی اضافه می‌شوند.
    فقط بخش‌های سفارشی کاربر را با جزئیات بیشتر و اصطلاحات عکاسی حرفه‌ای بسط دهید.
    خروجی شما باید فقط پرامپت بهبود یافته باشد، بدون هیچ مقدمه یا توضیحی.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // مدل انتخاب شده برای تولید متن
      contents: {
        parts: [{ text: `کاربر می‌خواهد این پرامپت را بهبود دهید: "${userPrompt}"` }],
      },
      config: {
        systemInstruction: systemInstruction, // دستورالعمل سیستمی برای هدایت مدل
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 500,
      },
    });

    if (response && response.text) {
      return response.text.trim();
    } else {
      throw new Error("مدل نتوانست پرامپت را بهبود بخشد. پاسخ متنی خالی بود.");
    }
  } catch (error) {
    console.error("Error refining prompt:", error);
    throw error;
  }
};
```

*   **API Key**: مشابه `enhanceImage`.
*   **مدل**: از `gemini-2.5-flash` که برای تولید متن بهینه شده است، استفاده می‌شود.
*   **`systemInstruction`**: یک دستورالعمل حیاتی است که نقش و وظیفه مدل را به عنوان یک "مهندس پرامپت عکاسی پرتره حرفه‌ای" تعریف می‌کند. این دستورالعمل به مدل می‌گوید که چگونه پرامپت کاربر را بسط دهد و بر گسترش جزئیات سفارشی کاربر تمرکز کند، بدون اینکه بخش‌های اصلی و ثابت پرامپت (حفظ هویت، کیفیت استودیویی) را تکرار کند.
*   **`config`**: شامل تنظیماتی مانند `temperature`, `topP`, `topK` برای کنترل خلاقیت و دقت مدل.
*   **استخراج خروجی**: متن بهبود یافته از `response.text` استخراج می‌شود.

### ۴.۴. نحوه مدیریت API Key

**نکته مهم**: کلید API **نباید** به صورت مستقیم در کد قرار داده شود. این برنامه کلید API را از متغیر محیطی `process.env.API_KEY` می‌خواند. این یک روش استاندارد و امن برای مدیریت کلیدهای API است که تضمین می‌کند کلید شما در سورس کد منتشر نمی‌شود. برای اجرای محلی، می‌توانید آن را در فایل `.env` تنظیم کنید و برای استقرار، در تنظیمات متغیرهای محیطی پلتفرم میزبان خود.

## ۵. تعریف تایپ‌ها (`types.ts`)

این فایل اینترفیس‌های TypeScript را برای ساختار داده‌های پرامپت تعریف می‌کند و به حفظ یکپارچگی و خوانایی کد کمک می‌کند.

*   **`PromptOption`**:
    ```typescript
    export interface PromptOption {
      value: string;
      label: string;
      tags?: string[]; // تگ‌های اختیاری برای فیلترینگ
    }
    ```
    این اینترفیس، ساختار پایه برای هر گزینه پرامپت را تعریف می‌کند: یک `value` (مقدار واقعی که به پرامپت اضافه می‌شود)، یک `label` (متنی که در UI نمایش داده می‌شود)، و `tags` (تگ‌های اختیاری برای فیلترینگ).
*   **`ClothingOption`**:
    ```typescript
    export interface ClothingOption extends PromptOption {
      gender: 'male' | 'female' | 'unisex' | 'child';
    }
    ```
    این اینترفیس `PromptOption` را بسط می‌دهد و یک فیلد `gender` را اضافه می‌کند که برای فیلتر کردن گزینه‌های لباس بر اساس جنسیت و سن استفاده می‌شود.
*   **`PromptData`**:
    ```typescript
    export interface PromptData {
      presets: PromptOption[];
      framing: PromptOption[];
      gender: PromptOption[];
      ageGroup: PromptOption[];
      clothing: ClothingOption[];
      backgrounds: PromptOption[];
      lighting: PromptOption[];
      cameras: PromptOption[];
      styles: PromptOption[];
      propsObjects: PromptOption[];
      photoSubject: PromptOption[];
      hairStyles: PromptOption[];
      makeup: PromptOption[];
      accessories: PromptOption[];
      facialExpressions: PromptOption[];
    }
    ```
    این اینترفیس ساختار کلی داده‌هایی که از فایل‌های JSON بارگذاری می‌شوند را تعریف می‌کند و تمام دسته‌بندی‌های گزینه‌های پرامپت را در خود جای می‌دهد.

## ۶. فایل‌های داده JSON (`public/data/*.json`)

این فایل‌ها منابع داده برای لیست‌های کشویی و گزینه‌های سفارشی‌سازی هستند. هر فایل JSON آرایه‌ای از اشیاء `PromptOption` یا `ClothingOption` را شامل می‌شود.

مثال: `public/data/backgrounds.json`
```json
[
  { "value": "", "label": "پیش‌فرض (پس‌زمینه موجود در تصویر)" },
  { "value": "on a beach at sunset.", "label": "در ساحل هنگام غروب آفتاب", "tags": ["outdoor", "nature", "beach", "sunset"] },
  { "value": "snowy mountain.", "label": "کوه برفی", "tags": ["outdoor", "nature", "winter", "mountain"] }
  // ... سایر گزینه‌ها
]
```
فیلد `tags` در برخی از این فایل‌ها (مانند `backgrounds.json` و `propsObjects.json`) برای پیاده‌سازی منطق فیلترینگ هوشمند استفاده می‌شود، به این صورت که گزینه‌های "اشیای همراه در صحنه" بر اساس تگ‌های پس‌زمینه انتخابی فیلتر می‌شوند.

## ۷. قابلیت دسترسی (Accessibility) و بین‌المللی‌سازی (Internationalization)

*   **RTL (راست به چپ)**: با استفاده از ویژگی `dir="rtl"` در `index.html` و در بسیاری از عناصر JSX، جهت‌گیری متن و چیدمان رابط کاربری برای زبان فارسی بهینه شده است.
*   **ARIA Attributes**: برای بهبود دسترسی‌پذیری برای کاربران با فناوری‌های کمکی (مانند Screen Reader ها)، از `aria-label`, `role="button"`, `aria-modal`, `aria-labelledby`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` در عناصر تعاملی و مودال‌ها استفاده شده است.

## ۸. مدیریت خطا

*   برنامه دارای مکانیزم‌های قوی برای مدیریت خطا است.
*   پیام‌های خطا (مانند "خطا در بهبود تصویر" یا "API_KEY is not defined") به صورت واضح در رابط کاربری نمایش داده می‌شوند (با پس‌زمینه قرمز برای خطا و سبز برای موفقیت).
*   خطاها در کنسول مرورگر نیز `console.error` می‌شوند تا برای اشکال‌زدایی مفید باشند.

## ۹. ملاحظات عملکردی

*   **`useCallback` و `useMemo`**: برای بهینه‌سازی عملکرد و جلوگیری از رندرینگ‌های غیرضروری، از هوک‌های `useCallback` برای توابع هندلر و `useMemo` برای کامپوننت `MemoizedImageDisplays` و گزینه‌های فیلتر شده (مانند `filteredClothingOptions` و `filteredPropsObjects`) استفاده شده است.
*   **بارگذاری تنبل (Lazy Loading)**: داده‌های JSON در ابتدا بارگذاری می‌شوند تا از تأخیر در دسترسی به گزینه‌ها جلوگیری شود، اما منطق بارگذاری هوشمند برای محتواهای بزرگتر می‌تواند پیاده‌سازی شود.

با این مستندات جامع، تمامی جنبه‌های برنامه SAPRA PHOTO ENHANCER از معماری تا جزئیات UI/UX و تعامل با API پوشش داده شده است.
