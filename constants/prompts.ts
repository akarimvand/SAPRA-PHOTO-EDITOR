// constants/prompts.ts

/**
 * Defines a structure for preset prompts and prompt building blocks.
 * Each item has a `value` (English prompt for the AI) and a `label` (Persian display text for the UI).
 * All prompts are gender-neutral to allow the AI to interpret gender based on the input image,
 * unless explicitly overridden by the new gender selection option.
 */

export const presetPrompts = [
  { value: '', label: 'بدون پرامپت آماده' }, // Simplified label, the core prompt describes standard enhancement
  { value: 'Classic studio portrait with soft lighting and neutral background, professional retouching, sharp focus, smooth skin, detailed textures, natural color correction, DSLR quality, timeless aesthetic.', label: 'پرتره استودیویی کلاسیک با نورپردازی نرم و پس‌زمینه خنثی' },
  { value: 'Outdoor portrait with natural light and shallow depth of field, vibrant colors, clear focus on subject, detailed environment blur, realistic skin tones, cinematic feel, professional outdoor photography.', label: 'پرتره در فضای باز با نور طبیعی و عمق میدان کم' },
  { value: 'Dramatic portrait with high contrast and deep shadows, intense mood, strong facial expressions, artistic lighting, detailed textures, powerful aesthetic, professional black and white conversion.', label: 'پرتره دراماتیک با کنتراست بالا و سایه‌های عمیق' },
  { value: 'Artistic black and white portrait with precise textures and details, strong composition, emotional depth, fine film grain, classic monochrome look, professional studio setup, timeless art piece.', label: 'پرتره هنری سیاه و سفید با بافت‌ و جزئیات دقیق' },
  { value: 'Fashion portrait with modern styling and pop colors, bold lighting, dynamic pose, sleek background, vibrant aesthetic, high-end editorial look, professional fashion photography.', label: 'پرتره فشن با استایلینگ مدرن و رنگ‌های پاپ' },
  { value: 'Cool urban photo of an individual in streetwear standing near neon lights, night city vibe, cinematic shadows, detailed clothing texture, sharp focus, DSLR quality, confident pose, soft reflections, high contrast lighting, professional editorial look, stylish and moody aesthetic.', label: 'استایل خیابانی شهری از فردی با لباس خیابانی (نور نئون و شب)'},
  { value: 'Elegant portrait of an individual wearing a suit and tie, neutral studio background, soft lighting, cinematic tone, sharp detail, clean focus, smooth skin texture, DSLR photo realism, sophisticated professional look, timeless classic portrait aesthetic.', label: 'پرتره باوقار کلاسیک از فردی با کت و شلوار و کراوات'},
  { value: 'Muscular individual working out in a gym, sweat details, focused expression, cinematic lighting, high contrast shadows, strong body definition, realistic skin tone, ultra-HD quality, dynamic pose, powerful and motivational atmosphere, professional sports photography style.', label: 'عکس ورزشی و باشگاه از فردی عضلانی (با تمرکز)'},
  { value: 'Adventurous individual standing on a mountain top, windy atmosphere, golden sunlight, detailed landscape, sharp focus, cinematic tones, high-resolution outdoor photography, realistic skin tones, rugged aesthetic, travel adventure photo style.', label: 'حس ماجراجویی در طبیعت از فردی (کوهستان و غروب)'},
  { value: 'Monochrome portrait of an individual looking sideways, dramatic lighting, deep contrast, fine detail on facial features, artistic film grain, emotional tone, professional black and white photography, timeless and cinematic aesthetic.', label: 'درام سیاه و سفید از فردی (نگاه از نیمرخ)'},
  { value: 'Casual individual walking by the beach at sunset, shirt slightly open, warm golden lighting, cinematic reflections on water, calm vibe, high-quality DSLR detail, natural tones, lifestyle fashion photography style, relaxed and confident pose.', label: 'سبک زندگی ساحلی از فردی با استایل کژوال (غروب آفتاب و آرامش)'},
  { value: 'Professional individual walking in a modern city street wearing formal attire, sharp focus, reflections on buildings, cinematic urban tones, DSLR photo quality, confident expression, soft light shadows, elegant corporate photography style.', label: 'ادیت کسب و کار شهری از فردی با لباس رسمی در خیابان'},
  { value: 'Individual wearing a winter coat and scarf in a snowy city street, moody tones, soft cold lighting, visible breath, cinematic contrast, ultra-HD detail, editorial photography style, stylish winter fashion vibe.', label: 'حال و هوای خیابان برفی از فردی (لباس زمستانی)'},
  { value: 'Creative portrait of an individual holding a mirror outdoors, dreamy lighting, reflection showing sky and clouds, artistic composition, cinematic tones, 4K clarity, deep emotional atmosphere, minimal aesthetic portrait photography style.', label: 'بازتاب آینه‌ای هنری از فردی (فضای باز و رویایی)'},
  { value: 'Vintage-style photo of an individual sitting beside a classic car, soft faded tones, nostalgic lighting, film grain texture, retro outfit, cinematic composition, warm sepia palette, authentic old-school aesthetic, high-quality DSLR realism.', label: 'ادیت وینتیج و رترو از فردی (ماشین کلاسیک)'},
  { value: 'Candid shot of an individual sitting in a coffee shop with sunlight streaming through the window, warm tones, cinematic shadows, detailed background blur, natural expression, lifestyle photography aesthetic, ultra-HD DSLR quality.', label: 'حس کافه از فردی (نور خورشید و طبیعی)'},
  { value: 'Dynamic photo of an individual running through a city street, motion blur, detailed muscles, focused expression, cinematic morning light, realistic tones, high shutter-speed DSLR look, energy and strength-focused action shot aesthetic.', label: 'اکشن ورزشی در خیابان از فردی (تاری حرکتی و انرژی)'},
  { value: 'Portrait of an individual with dramatic shadows on their face, golden hour lighting, artistic photography, fine facial detail, cinematic tone, ultra-HD realism, expressive emotional vibe, moody portrait aesthetic.', label: 'پرتره سایه‌های دراماتیک از فردی (نور طلایی)'},
  { value: 'Stylish individual standing on a rooftop during sunset, glowing city background, cinematic lighting, confident pose, soft golden tones, professional DSLR quality, urban skyline aesthetic, modern vibe.', label: 'ادیت ساعت طلایی پشت بام از فردی (منظره شهر)'},
  { value: 'Studio portrait of an individual in black turtleneck, plain background, soft diffused lighting, clean contrast, detailed texture, DSLR focus, professional fashion editorial look, high-end minimal aesthetic in 4K quality.', label: 'شات فشن استودیویی مینیمال از فردی (یقه اسکی مشکی)'},
  // New Iranian-themed presets
  { value: 'Portrait of an individual in traditional Persian attire, intricate patterns, vibrant colors, set against a backdrop of ancient Persian architecture, soft, warm lighting, emphasizing cultural richness and historical elegance.', label: 'پرتره با لباس سنتی ایرانی در معماری کهن' },
  { value: 'Modern Iranian portrait, showcasing an individual with contemporary fashion blended with subtle traditional elements, in an urban Tehran backdrop, dramatic evening lighting, conveying a sophisticated and artistic aesthetic.', label: 'پرتره مدرن ایرانی با استایل معاصر و نمادهای سنتی در تهران' },
  { value: 'A thoughtful portrait of an individual in a traditional Iranian house, with intricate tilework and natural light filtering through stained-glass windows, creating a serene and culturally rich atmosphere.', label: 'پرتره متفکرانه در خانه سنتی ایرانی با نور رنگی' },
];

export const promptBuildingBlocks = {
  gender: {
    label: 'جنسیت',
    options: [
      { value: '', label: 'پیش‌فرض (مدل جنسیت را تشخیص دهد)' },
      { value: 'male', label: 'مرد' },
      { value: 'female', label: 'زن' },
    ],
  },
  framingCrop: {
    label: 'کادربندی و برش',
    options: [
      { value: '', label: 'پیش‌فرض (مدل کادربندی را انتخاب کند)' },
      { value: 'full body shot', label: 'تمام قد' },
      { value: 'half body shot', label: 'نیم‌تنه' },
      { value: 'face shot', label: 'چهره' },
      { value: 'close-up face shot', label: 'چهره بسته (کلوزآپ)' },
    ],
  },
  clothingAccessories: {
    label: 'لباس و لوازم جانبی',
    options: [
      { value: '', label: 'پیش‌فرض (لباس موجود در تصویر)' },
      { value: 'draped in a sheer, flowing red chiffon saree with a delicate embroidered border.', label: 'سارافون حریر قرمز روان با حاشیه دوزی ظریف' },
      { value: 'tailored navy suit.', label: 'کت و شلوار سرمه‌ای دوخته شده' },
      { value: 'white summer dress with floral embroidery.', label: 'پیراهن تابستانی سفید با گلدوزی گلدار' },
      { value: 'glamorous evening gown.', label: 'لباس شب پر زرق و برق' },
      { value: 'casual denim jacket with sneakers.', label: 'ژاکت جین کژوال با کتانی' },
      { value: 'traditional kurta with silk dupatta.', label: 'کرتا سنتی با دوپاتای ابریشمی' },
      { value: 'classic black tuxedo with a bow tie.', label: 'تاکسیدو مشکی کلاسیک با پاپیون'},
      { value: 'vibrant floral pattern dress.', label: 'پیراهن با طرح گل‌های شاداب'},
      { value: 'sleek leather jacket and dark jeans.', label: 'ژاکت چرمی شیک و جین تیره'},
      { value: 'elegant silk blouse and trousers.', label: 'بلوز ابریشمی و شلوار مجلسی'},
    ],
  },
  backgroundEnvironment: {
    label: 'پس‌زمینه و محیط',
    options: [
      { value: '', label: 'پیش‌فرض (پس‌زمینه موجود در تصویر)' },
      { value: 'on a beach at sunset.', label: 'در ساحل هنگام غروب آفتاب' },
      { value: 'snowy mountain.', label: 'کوه برفی' },
      { value: 'Paris street with Eiffel Tower.', label: 'خیابان پاریس با برج ایفل' },
      { value: 'neon-lit city at night.', label: 'شهر با نور نئون در شب' },
      { value: 'cozy coffee shop.', label: 'کافی‌شاپ دنج' },
      { value: 'tropical forest.', label: 'جنگل گرمسیری' },
      { value: 'rooftop party.', label: 'مهمانی روی پشت بام' },
      { value: 'bustling Tokyo street at night.', label: 'خیابان شلوغ توکیو در شب'},
      { value: 'serene Japanese garden in autumn.', label: 'باغ آرام ژاپنی در پاییز'},
      { value: 'minimalist white studio.', label: 'استودیوی سفید مینیمالیستی'},
      { value: 'historic library with towering bookshelves.', label: 'کتابخانه تاریخی با قفسه‌های بلند'},
      { value: 'an ancient Persian garden with intricate tilework and fountains.', label: 'یک باغ باستانی ایرانی با کاشی‌کاری‌های ظریف و فواره‌ها' },
      { value: 'a bustling Iranian bazaar with colorful spices and traditional crafts.', label: 'یک بازار شلوغ ایرانی با ادویه‌های رنگارنگ و صنایع دستی سنتی' },
    ],
  },
  lightingAtmosphere: {
    label: 'نورپردازی و اتمسفر',
    options: [
      { value: '', label: 'پیش‌فرض (نورپردازی موجود در تصویر)' },
      { value: 'with warm, golden light backlighting and casting a beautiful glow.', label: 'با نور گرم طلایی که از پشت می‌تابد و درخشش زیبایی ایجاد می‌کند.' },
      { value: 'soft golden-hour sunlight.', label: 'نور خورشید نرم ساعت طلایی' },
      { value: 'dramatic cinematic shadows.', label: 'سایه‌های دراماتیک سینمایی' },
      { value: 'bright daylight.', label: 'نور روز روشن' },
      { value: 'neon nightlife glow.', label: 'درخشش نئون شبانه' },
      { value: 'candlelight indoors.', label: 'نور شمع در فضای داخلی' },
      { value: 'misty morning light.', label: 'نور مه‌آلود صبحگاهی' },
      { value: 'moody chiaroscuro lighting.', label: 'نورپردازی کنتراست‌بالا (چیاروسکورو) و پر رمز و راز'},
      { value: 'soft, diffused window light.', label: 'نور نرم و پخش‌شده از پنجره'},
      { value: 'high-key, bright and airy.', label: 'نورپردازی روشن و با طراوت (های‌کی)'},
      { value: 'dusk blue hour glow.', label: 'درخشش آبی ساعت گرگ و میش'},
      { value: 'Rembrandt lighting with a distinct triangle of light on the cheek, emphasizing depth and drama.', label: 'نورپردازی رامبراند (با مثلث نوری روی گونه)' }, // New Rembrandt lighting
    ],
  },
  cameraSettings: {
    label: 'دوربین و تنظیمات',
    options: [
      { value: '', label: 'پیش‌فرض (تنظیمات استودیویی حرفه‌ای)' },
      { value: 'Shot on a Canon EOS 5D Mark IV with an 85mm f/1.4 lens, ISO 100, f/1.8 aperture.', label: 'عکاسی شده با Canon EOS 5D Mark IV و لنز 85mm f/1.4' },
      { value: 'Shot on a Sony A7R IV with a 35mm f/1.4 lens, ISO 400, f/2.0 aperture.', label: 'عکاسی شده با Sony A7R IV و لنز 35mm f/1.4' },
      { value: 'Shot on a Nikon Z9 with a 70–200mm f/2.8 lens, ISO 200, f/2.5 aperture.', label: 'عکاسی شده با Nikon Z9 و لنز 70-200mm f/2.8' },
      { value: 'Shot on a Fujifilm X-T5 with a 56mm f/1.2 lens, ISO 800, f/1.4 aperture.', label: 'عکاسی شده با Fujifilm X-T5 و لنز 56mm f/1.2' },
      { value: 'Shot on a Hasselblad X1D II 50C with an 80mm f/1.9 lens, ISO 160, f/2.2 aperture.', label: 'عکاسی شده با Hasselblad X1D II 50C و لنز 80mm f/1.9'},
      { value: 'Shot on a Leica SL2-S with a 50mm f/2.0 Summicron lens, ISO 320, f/2.8 aperture.', label: 'عکاسی شده با Leica SL2-S و لنز 50mm f/2.0'},
    ],
  },
  styleNotes: {
    label: 'نکات سبک و استایل',
    options: [
      { value: '', label: 'پیش‌فرض (واقع‌گرایانه و سینمایی)' },
      { value: 'Cinematic, dreamy, and ultra-realistic, 4K.', label: 'سینمایی، رویایی، فوق‌واقع‌گرایانه، 4K' },
      { value: 'editorial, vibrant, fashion magazine.', label: 'ادیتوریال، پرجنب و جوش، مجله مد' },
      { value: 'soft-focus romantic.', label: 'فوکوس نرم رمانتیک' },
      { value: 'high-contrast cinematic.', label: 'سینمایی با کنتراست بالا' },
      { value: 'natural documentary style.', label: 'سبک مستند طبیعی' },
      { value: 'painterly, impressionistic brushstrokes.', label: 'نقاشی‌گونه، با ضربه‌های قلم موی امپرسیونیستی'},
      { value: 'vaporwave aesthetic, neon glow, retrofuturistic.', label: 'استایل ویپورویو، نور نئون، رتروفوتوریستیک'},
      { value: 'gritty, urban, street photography feel.', label: 'حس خشن، شهری، عکاسی خیابانی'},
      { value: 'ethereal, fantastical, dreamlike.', label: 'اثیری، فانتزی، شبیه رویا'},
    ],
  },
  propsObjects: {
    label: 'اشیای همراه در صحنه',
    options: [
      { value: '', label: 'پیش‌فرض (بدون شیء خاص)' },
      { value: 'posed next to a vintage classic car.', label: 'کنار یک خودروی کلاسیک وینتیج' },
      { value: 'standing beside an ancient Persian sculpture, rich in detail and history.', label: 'ایستاده کنار یک مجسمه باستانی ایرانی، غنی از جزئیات و تاریخ' },
      { value: 'holding a traditional Persian instrument like a Setar or Tar.', label: 'در حال نگهداری یک ساز سنتی ایرانی مانند سه‌تار یا تار' },
      { value: 'with a modern art sculpture in a gallery setting.', label: 'با یک مجسمه هنری مدرن در محیط گالری' },
      { value: 'sitting on a plush velvet armchair.', label: 'نشسته روی یک مبل راحتی مخملی' },
      { value: 'near a bookshelf filled with old, leather-bound books.', label: 'کنار قفسه کتابی پر از کتاب‌های قدیمی با جلد چرمی' },
    ],
  },
};