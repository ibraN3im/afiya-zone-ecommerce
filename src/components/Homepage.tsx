import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { productsAPI } from '../services/api';
import { Star, Leaf, Heart, Shield, ArrowRight, ShoppingCart } from 'lucide-react';
import { features } from 'process';
import { useEffect, useState } from 'react';

const translations = {
  en: {
    heroSubtitle: 'Your Trusted Care & Wellness Zone',
    shopNow: 'Shop Now',
    learnMore: 'Learn More',
    featuredProducts: 'Featured Products',
    viewAll: 'View All Products',
    addToCart: 'Add to Cart',
    whyChooseUs: 'Why Choose Afiya Zone?',
    naturalIngredients: 'Natural Ingredients',
    naturalDesc: 'All our products are made with carefully selected natural ingredients',
    trustedQuality: 'Trusted Quality',
    trustedDesc: 'Rigorous testing and quality control for your peace of mind',
    expertCare: 'Expert Care',
    expertDesc: 'Formulated by wellness experts and health professionals',
    secureShipping: 'Secure Shipping',
    secureDesc: 'Fast, secure delivery to your doorstep',
    tipTitle1: '5 Morning Rituals for Better Health',
    tipTitle2: 'Natural Ways to Boost Your Immunity',
    tipTitle3: 'The Power of Herbal Supplements',
    readMore: 'Read More',
  },
  ar: {
    heroTitle: 'عافيه زون للرعاية والمثوقة',
    heroSubtitle: 'اكتشف الادوات الطبية والمنتجات الطبيعية المميزة لحياه أكثر صحه وسعادة',
    shopNow: 'تسوق  الآن',
    learnMore: 'اعرف المزيد',
    featuredProducts: 'المنتجات المميزة',
    viewAll: 'عرض جميع المنتجات',
    addToCart: 'أضف للسلة',
    whyChooseUs: 'لماذا تختار عافيه زون؟',
    naturalIngredients: 'مكونات طبيعية',
    naturalDesc: 'جميع منتجاتنا مصنوعة من مكونات طبيعية مختارة بعناية',
    trustedQuality: 'جودة موثوقة',
    trustedDesc: 'اختبارات صارمة ومراقبة جودة لراحة بالك',
    expertCare: 'رعاية خبراء',
    expertDesc: 'مُركبة من قبل خبراء العافية والمهنيين الصحيين',
    secureShipping: 'شحن آمن',
    secureDesc: 'توصيل سريع وآمن إلى باب منزلك',
    wellnessTips: 'نصائح ورؤى العافية',
    tipTitle1: ' طقوس صباحية لصحة أفضل',
    tipTitle2: 'طرق طبيعية لتعزيز مناعتك',
    tipTitle3: 'قوة المكملات العشبية',
    readMore: 'اقرأ المزيد',
  },
};

export function Homepage() {
  const { language, setCurrentPage, setSelectedProduct, cart, setCart } = useApp();
  const t = translations[language];
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await productsAPI.getAll({ isFeatured: 'true' });
        // Limit to 4 products for display
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        // Fallback to hardcoded data if API fails
        setFeaturedProducts([
          {
            id: 1,
            name: { en: 'Vitamin D3 + K2', ar: 'فيتامين د3 + ك2' },
            description: { en: 'Vitamin D3 + K2 for bone health', ar: 'فيتامين د3 + ك2 لصحة العظام' },
            price: 29.99,
            originalPrice: 39.99,
            rating: 4.8,
            reviews: 152,
            image: 'https://images.unsplash.com/photo-1734607402858-a10164ded7a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc3VwcGxlbWVudHMlMjB2aXRhbWluc3xlbnwxfHx8fDE3NTkwNzU2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            category: 'supplements',
            badge: { en: 'Best Seller', ar: 'الأكثر مبيعاً' },
          },
          {
            id: 2,
            name: { en: 'Organic Face Serum', ar: 'سيروم الوجه العضوي' },
            description: { en: 'Pure organic face serum for glowing skin', ar: 'سيروم وجه عضوي طبيعي لبشرة مشرقة' },
            price: 45.99,
            rating: 4.9,
            reviews: 89,
            image: 'https://images.unsplash.com/photo-1723392197044-515b81ec57cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwc2tpbmNhcmUlMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzU5MDc1NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            category: 'cosmetics',
            badge: { en: 'New', ar: 'جديد' },
          },
          {
            id: 3,
            name: { en: 'Herbal Sleep Tea', ar: 'شاي النوم العشبي' },
            description: { en: 'Herbal sleep tea for a good night\'s sleep', ar: 'شاي النوم العشبي لعدة ساعات نوم جيدة' },
            price: 18.99,
            rating: 4.7,
            reviews: 203,
            image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBlc3NlbnRpYWwlMjBvaWxzfGVufDF8fHx8MTc1OTA3NTYyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            category: 'herbal',
            badge: { en: 'Popular', ar: 'رائج' },
          },
          {
            id: 4,
            name: { en: 'Herbal Sleep Tea', ar: 'شاي النوم العشبي' },
            description: { en: 'Herbal sleep tea for a good night\'s sleep', ar: 'شاي النوم العشبي لعدة ساعات نوم جيدة' },
            price: 18.99,
            rating: 4.7,
            reviews: 203,
            image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBlc3NlbnRpYWwlMjBvaWxzfGVufDF8fHx8MTc1OTA3NTYyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            category: 'herbal',
            badge: { en: 'Popular', ar: 'رائج' },
          },
        ]);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item._id === product._id || item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        (item._id === product._id || item.id === product.id)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const viewProduct = (product: any) => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  const handleRatingClick = async (productId: string, ratingValue: number) => {
    try {
      // Send the rating to the backend
      const response = await productsAPI.rateProduct(productId, ratingValue);

      toast.success(response.message || 'Thank you for your rating!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit rating. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-image relative bg-gradient-to-br from-green-50 via-white to-green-50 sm:py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4 mb-4">
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t.heroSubtitle}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 md:px-8 md:py-3"
                  onClick={() => setCurrentPage('shop')}
                >
                  {t.shopNow}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-7 featured-products">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h4 className="Featured text-2xl text-green-800 mb-4">{t.featuredProducts}</h4>
            <Button
              variant="link"
              className="text-green-600 hover:text-green-700"
              onClick={() => setCurrentPage('shop')}
            >
              {t.viewAll} <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>

          <div className="product-grid-container">
            {featuredProducts.map((product) => (
              <div key={product._id || product.id} className="product-grid-item">
                <div className="product-image-container-home">
                  <ImageWithFallback
                    src={product.images?.[0] || product.image}
                    alt={product.name?.[language] || product.name?.en || 'Product'}
                    className="product-image-home"
                  />
                  {(product.badge || product.isNew) && (
                    <div className="product-badge">
                      {product.badge?.[language] || product.badge?.en || (product.isNew ? (language === 'en' ? 'New' : 'جديد') : '')}
                    </div>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="product-discount-badge">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  {!product.originalPrice && product.discount && product.discount > 0 && (
                    <div className="product-discount-badge">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                <div className="product-info-home">
                  <div className="p-6">
                    <h3
                      className="product-title"
                      onClick={() => viewProduct(product)}
                    >
                      {product.name?.[language] || product.name?.en || 'Unnamed Product'}
                    </h3>
                    <div className="product-description">
                      <p>{product.description?.[language] || product.description?.en || '-'}</p>
                    </div>
                    <div className="product-rating">
                      <div className="rating-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`rating-star ${i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                              }`}
                            onClick={() => handleRatingClick(product._id || product.id, i + 1)}
                          />
                        ))}
                      </div>
                      <span className="rating-count">
                        ({product.reviews || 0})
                      </span>
                    </div>

                    <div className="product-price">
                      AED {product.price?.toFixed(2) || '0.00'}
                      {(product.originalPrice && product.originalPrice > product.price) && (
                        <span className="original-price">
                          AED {product.originalPrice?.toFixed(2) || '0.00'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-2 pt-0">
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn w-full"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us py-12 px-4 bg-gradient-to-br from-green-50 to-white sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-lg text-green-800 mb-2">{t.whyChooseUs}</h2>
          </div>

          <div className="product-grid-container">
            {[
              {
                icon: Leaf,
                title: t.naturalIngredients,
                description: t.naturalDesc,
              },
              {
                icon: Shield,
                title: t.trustedQuality,
                description: t.trustedDesc,
              },
              {
                icon: Heart,
                title: t.expertCare,
                description: t.expertDesc,
              },
              {
                icon: ArrowRight,
                title: t.secureShipping,
                description: t.secureDesc,
              },
            ].map((feature, index) => (
              <div key={index} className="product-grid-item">
                <div className="why-choose-afiya">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                  </div>
                  <h3 className="product-title text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-center">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}