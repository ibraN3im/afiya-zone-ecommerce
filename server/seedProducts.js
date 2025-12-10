import Product from './models/Product.js';
import connectDB from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  {
    name: { en: 'Digital Blood Pressure Monitor', ar: 'جهاز قياس ضغط الدم الرقمي' },
    description: {
      en: 'Professional digital blood pressure monitor with large LCD display and memory function',
      ar: 'جهاز قياس ضغط الدم الرقمي الاحترافي بشاشة LCD كبيرة وظيفة ذاكرة'
    },
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.7,
    reviews: 234,
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMHByZXNzdXJlJTIwbW9uaXRvcnxlbnwwfHx8fDE3NTkwNzY4NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZXF1aXBtZW50fGVufDB8fHx8MTc1OTA3Njg0Nnw&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    category: 'medical',
    badge: { en: 'Professional', ar: 'احترافي' },
    stock: 45,
    isFeatured: true, // Mark as featured
    isPopular: true, // Mark as popular
    features: [
      { en: 'FDA approved', ar: 'معتمد من FDA' },
      { en: 'One-touch measurement', ar: 'قياس بلمسة واحدة' },
      { en: 'Memory for 60 readings', ar: 'ذاكرة لـ 60 قراءة' },
      { en: 'Irregular heartbeat detection', ar: 'كشف عدم انتظام ضربات القلب' }
    ]
  },
  {
    name: { en: 'Pulse Oximeter', ar: 'جهاز قياس نبض الأكسجين' },
    description: {
      en: 'Portable finger pulse oximeter for accurate blood oxygen saturation monitoring',
      ar: 'جهاز قياس نبض الأكسجين المحمول للإشراف الدقيق على تشبع الأكسجين في الدم'
    },
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.6,
    reviews: 189,
    images: [
      'https://images.unsplash.com/photo-1584456319363-d6a9ca8d25c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxveGltZXRlciUyMG1lZGljYWx8ZW58MHx8fHwxNzU5MDc2ODc3fA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMHByZXNzdXJlJTIwbW9uaXRvcnxlbnwwfHx8fDE3NTkwNzY4NDV8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    category: 'medical',
    badge: { en: 'Portable', ar: 'محمول' },
    stock: 120,
    isFeatured: true, // Mark as featured
    isPopular: true, // Mark as popular
    features: [
      { en: 'Accurate SpO2 measurement', ar: 'قياس SpO2 دقيق' },
      { en: 'Pulse rate display', ar: 'عرض معدل النبض' },
      { en: 'LED display', ar: 'شاشة LED' },
      { en: 'Compact and lightweight', ar: 'مدمج وخفيف الوزن' }
    ]
  },
  {
    name: { en: 'Digital Thermometer', ar: 'ميزان حرارة رقمي' },
    description: {
      en: 'Clinical grade digital thermometer for accurate body temperature measurement',
      ar: 'ميزان حرارة رقمي من الفئة السريرية لقياس درجة حرارة الجسم بدقة'
    },
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.5,
    reviews: 312,
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMHByZXNzdXJlJTIwbW9uaXRvcnxlbnwwfHx8fDE3NTkwNzY4NDV8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    category: 'medical',
    badge: { en: 'Essential', ar: 'أساسي' },
    stock: 200,
    features: [
      { en: 'Fever alarm', ar: 'إنذار الحمى' },
      { en: 'Memory recall', ar: 'استدعاء الذاكرة' },
      { en: 'Waterproof tip', ar: 'طرف مقاوم للماء' },
      { en: 'Fast reading in 60 seconds', ar: 'قراءة سريعة في 60 ثانية' }
    ]
  },
  {
    name: { en: 'Nebulizer Machine', ar: 'جهاز تبخير' },
    description: {
      en: 'Professional nebulizer for effective respiratory medication delivery at home',
      ar: 'جهاز تبخير احترافي لتوصيل الأدوية التنفسية الفعالة في المنزل'
    },
    price: 189.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviews: 156,
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZXF1aXBtZW50fGVufDB8fHx8MTc1OTA3Njg0Nnw&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    category: 'medical',
    badge: { en: 'Home Care', ar: 'الرعاية المنزلية' },
    stock: 35,
    isFeatured: true, // Mark as featured
    isPopular: true, // Mark as popular
    features: [
      { en: 'Quiet operation', ar: 'تشغيل هادئ' },
      { en: 'Efficient medication delivery', ar: 'توصيل الدواء بكفاءة' },
      { en: 'Adult and child masks', ar: 'أقنعة للكبار والأطفال' },
      { en: 'Portable design', ar: 'تصميم محمول' }
    ]
  },
  {
    name: { en: 'Vitamin D3 + K2', ar: 'فيتامين د3 + ك2' },
    description: {
      en: 'High-quality vitamin D3 and K2 supplement for bone health and immune support',
      ar: 'مكمل فيتامين د3 و ك2 عالي الجودة لصحة العظام ودعم المناعة'
    },
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.8,
    reviews: 152,
    images: [
      'https://images.unsplash.com/photo-1734607402858-a10164ded7a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc3VwcGxlbWVudHMlMjB2aXRhbWluc3xlbnwxfHx8fDE3NTkwNzU2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1714411892980-d1fa234f61ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHN1cHBsZW1lbnQlMjBib3R0bGV8ZW58MXx8fHwxNzU5MDc1NzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1671492241057-e0ad01ceb1c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG5hdHVyYWwlMjBwcm9kdWN0cyUyMHNwYXxlbnwxfHx8fDE3NTkwNzU2MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    category: 'supplements',
    badge: { en: 'Best Seller', ar: 'الأكثر مبيعاً' },
    stock: 150,
    isFeatured: true, // Mark as featured
    isPopular: true, // Mark as popular
    features: [
      { en: 'Supports bone health', ar: 'يدعم صحة العظام' },
      { en: 'Boosts immune system', ar: 'يعزز جهاز المناعة' },
      { en: 'Natural ingredients', ar: 'مكونات طبيعية' }
    ]
  },
  {
    name: { en: 'Organic Face Serum', ar: 'سيروم الوجه العضوي' },
    description: {
      en: 'Premium organic face serum for radiant and youthful skin',
      ar: 'سيروم وجه عضوي ممتاز لبشرة مشرقة وشابة'
    },
    price: 45.99,
    rating: 4.9,
    reviews: 89,
    images: [
      'https://images.unsplash.com/photo-1723392197044-515b81ec57cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwc2tpbmNhcmUlMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzU5MDc1NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1623378034307-9b3b0c0b2a5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwc2tpbmNhcmUlMjBwcm9kdWN0fGVufDF8fHx8MTc1OTA3NTc1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    category: 'cosmetics',
    badge: { en: 'New', ar: 'جديد' },
    stock: 80,
    features: [
      { en: '100% organic', ar: '100٪ عضوي' },
      { en: 'Anti-aging formula', ar: 'تركيبة مضادة للشيخوخة' },
      { en: 'Paraben-free', ar: 'خالي من البارابين' }
    ]
  },
  {
    name: { en: 'Herbal Sleep Tea', ar: 'شاي النوم العشبي' },
    description: {
      en: 'Calming herbal tea blend for better sleep quality',
      ar: 'مزيج شاي عشبي مهدئ لنوم أفضل'
    },
    price: 18.99,
    rating: 4.7,
    reviews: 203,
    images: [
      'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBlc3NlbnRpYWwlMjBvaWxzfGVufDF8fHx8MTc1OTA3NTYyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1627863840061-95c44c4e0e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBwcm9kdWN0fGVufDF8fHx8MTc1OTA3NTc1NXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    category: 'herbal',
    badge: { en: 'Popular', ar: 'رائج' },
    stock: 200,
    isFeatured: true, // Mark as featured
    isPopular: true, // Mark as popular
    features: [
      { en: 'Natural sleep aid', ar: 'مساعد طبيعي للنوم' },
      { en: 'Caffeine-free', ar: 'خالي من الكافيين' },
      { en: 'Organic herbs', ar: 'أعشاب عضوية' }
    ]
  },
  {
    name: { en: 'Omega-3 Fish Oil', ar: 'زيت السمك أوميغا-3' },
    description: {
      en: 'Premium omega-3 supplement for heart and brain health',
      ar: 'مكمل أوميغا-3 ممتاز لصحة القلب والدماغ'
    },
    price: 24.99,
    rating: 4.6,
    reviews: 176,
    images: [
      'https://images.unsplash.com/photo-1734607402858-a10164ded7a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc3VwcGxlbWVudHMlMjB2aXRhbWluc3xlbnwxfHx8fDE3NTkwNzU2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1714411892980-d1fa234f61ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHN1cHBsZW1lbnQlMjBib3R0bGV8ZW58MXx8fHwxNzU5MDc1NzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    category: 'supplements',
    stock: 120,
    features: [
      { en: 'Supports heart health', ar: 'يدعم صحة القلب' },
      { en: 'Brain function', ar: 'وظائف المخ' },
      { en: 'Wild-caught fish', ar: 'سمك بري' }
    ]
  },
  {
    name: { en: 'Natural Body Lotion', ar: 'لوشن الجسم الطبيعي' },
    description: {
      en: 'Moisturizing body lotion with natural ingredients',
      ar: 'لوشن جسم مرطب بمكونات طبيعية'
    },
    price: 19.99,
    rating: 4.5,
    reviews: 98,
    images: [
      'https://images.unsplash.com/photo-1723392197044-515b81ec57cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwc2tpbmNhcmUlMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzU5MDc1NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1623378034307-9b3b0c0b2a5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwc2tpbmNhcmUlMjBwcm9kdWN0fGVufDF8fHx8MTc1OTA3NTc1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1671492241057-e0ad01ceb1c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG5hdHVyYWwlMjBwcm9kdWN0cyUyMHNwYXxlbnwxfHx8fDE3NTkwNzU2MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    category: 'cosmetics',
    stock: 95,
    features: [
      { en: 'Deep hydration', ar: 'ترطيب عميق' },
      { en: 'Non-greasy', ar: 'غير دهني' },
      { en: 'All skin types', ar: 'جميع أنواع البشرة' }
    ]
  },
  {
    name: { en: 'Detox Green Tea', ar: 'شاي أخضر ديتوكس' },
    description: {
      en: 'Detoxifying green tea blend for cleansing and energy',
      ar: 'مزيج شاي أخضر منظف للطاقة والتنقية'
    },
    price: 16.99,
    rating: 4.4,
    reviews: 134,
    images: [
      'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBlc3NlbnRpYWwlMjBvaWxzfGVufDF8fHx8MTc1OTA3NTYyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1627863840061-95c44c4e0e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBwcm9kdWN0fGVufDF8fHx8MTc1OTA3NTc1NXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    category: 'herbal',
    stock: 180,
    features: [
      { en: 'Detoxifying', ar: 'منظف للسموم' },
      { en: 'Antioxidant-rich', ar: 'غني بمضادات الأكسدة' },
      { en: 'Energy boost', ar: 'يعزز الطاقة' }
    ]
  }
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('✅ successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();