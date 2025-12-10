import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';
import { productsAPI } from '../services/api';

const translations = {
  en: {
    backToShop: 'Back to Shop',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    quantity: 'Quantity',
    addToCart: 'Add to Cart',
    addToWishlist: 'Add to Wishlist',
    share: 'Share',
    description: 'Desc..',
    benefits: 'Benefi..',
    usage: 'Usages',
    ingredients: 'Ingre..',
    specifications: 'Specifications',
    relatedProducts: 'Related Products',
    addedToCart: 'Product added successfully!',
    addedToWishlist: 'Product added wishlist!',
    selectQuantity: 'Select quantity',
    loading: 'Loading product...',
    error: 'Failed to load product',
    features: 'Features',
    category: 'Category',
    price: 'Price',
    originalPrice: 'Original Price',
    discount: 'Discount',
    stock: 'Stock',
    createdAt: 'Added On',
    updatedAt: 'Last Updated',
    noFeatures: 'No features available',
    noBenefits: 'No benefits available',
    noIngredients: 'No ingredients listed',
    noUsageInstructions: 'No usage instructions provided',
  },
  ar: {
    backToShop: 'العودة إلى المتجر',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    quantity: 'الكمية',
    addToCart: 'أضف للسلة',
    addToWishlist: 'أضف إلى المفضلة',
    share: 'مشاركة',
    description: 'وصف',
    benefits: 'فوائد',
    usage: ' استخدام',
    ingredients: 'مكونات',
    specifications: 'مواصفات',
    relatedProducts: 'منتجات ذات صلة',
    addedToCart: 'تم إضافته !',
    addedToWishlist: 'تم إضافته !',
    selectQuantity: 'اختر الكمية',
    loading: 'جارٍ تحميل المنتج...',
    error: 'فشل تحميل المنتج',
    features: 'الميزات',
    category: 'الفئة',
    price: 'السعر',
    originalPrice: 'السعر الأصلي',
    discount: 'الخصم',
    stock: 'المخزون',
    createdAt: 'تاريخ الإضافة',
    updatedAt: 'آخر تحديث',
    noFeatures: 'لا توجد ميزات متاحة',
    noBenefits: 'لا توجد فوائد متاحة',
    noIngredients: 'لم يتم إدراج مكونات',
    noUsageInstructions: 'لم يتم توفير تعليمات الاستخدام',
  },
};

export function ProductDetail() {
  const { language, setCurrentPage, selectedProduct: contextSelectedProduct, cart, setCart } = useApp();
  const t = translations[language];

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product data if we have an ID but no product data
  useEffect(() => {
    const fetchProduct = async () => {
      // If we already have product data from context, use it
      if (contextSelectedProduct) {
        setProduct(contextSelectedProduct);
        setLoading(false);
        return;
      }

      // If no product data is available, show error
      setError(t.error);
      setLoading(false);
    };

    fetchProduct();
  }, [contextSelectedProduct, t.error]);

  const addToCart = () => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    toast.success(t.addedToCart);
  };

  const addToWishlist = () => {
    toast.success(t.addedToWishlist);
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name[language],
        text: product.description[language],
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(language === 'en' ? 'Link copied to clipboard!' : 'تم نسخ الرابط إلى الحافظة!');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-red-500">{error || t.error}</p>
            <Button
              onClick={() => setCurrentPage('shop')}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              {language === 'en' ? 'Back to Shop' : 'العودة إلى المتجر'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        {/* Back Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentPage('shop')}
          className="mb-6 border-green-600 text-green-600 hover:bg-green-50"
        >
          ← {t.backToShop}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <ImageWithFallback
                src={product.images?.[currentImageIndex] || '/placeholder-product.jpg'}
                alt={product.name[language]}
                className="w-full lg:h-[500px] object-cover rounded-xl shadow-lg"
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                  {language === 'en' ? 'New' : 'جديد'}
                </Badge>
              )}
              {product.discount && product.discount > 0 && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    title={`${product.name[language]} thumbnail ${index + 1}`}
                    aria-label={`${product.name[language]} thumbnail ${index + 1}`}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex ? 'border-green-500' : 'border-gray-200'
                      }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name[language]} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h5 className="text-green-600 mb-2">{product.name[language]}</h5>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 cursor-pointer ${i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                        }`}
                      onClick={() => handleRatingClick(product._id, i + 1)}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">
                  {product.rating?.toFixed(1) || '0.0'} ({language === 'en' ? 'Rating' : 'تقييم'})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="price text-3xl text-green-700">AED {product.price?.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="price text-xl text-gray-500 line-through">
                    AED {product.originalPrice?.toFixed(2)}
                  </span>
                )}
                {product.discount && product.discount > 0 && (
                  <Badge variant="destructive">
                    {language === 'en' ? `${product.discount}% OFF` : `${product.discount}% خصم`}
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <Badge
                  variant={product.stock > 0 ? 'default' : 'destructive'}
                  className={product.stock > 0 ? 'bg-green-100 text-green-800' : ''}
                >
                  {product.stock > 0 ? `${product.stock} ${language === 'en' ? 'in stock' : 'متوفر'}` : t.outOfStock}
                </Badge>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="text-green-600">{t.category}: </span>
                <span className="text-gray-600 capitalize">
                  {product.category?.replace('-', ' ') || 'N/A'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <small className="text-gray-700">
                {product.description?.[language] || product.description?.en || 'No description available.'}
              </small>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-green-800">{t.quantity}</label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  disabled={product.stock > 0 ? quantity >= product.stock : false}
                  className="w-10 h-10 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="add-to-cart-btn"
                onClick={addToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0
                  ? (language === 'en' ? 'Out of Stock' : 'غير متوفر')
                  : null} {language === 'en' ? 'Add to Cart' : 'أضف إلى العربة'}
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                  onClick={addToWishlist}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  {t.addToWishlist}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                  onClick={shareProduct}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  {t.share}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-green-50">
              <TabsTrigger value="description" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                {t.description}
              </TabsTrigger>
              <TabsTrigger value="benefits" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                {t.benefits}
              </TabsTrigger>
              <TabsTrigger value="usage" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                {t.usage}
              </TabsTrigger>

              <TabsTrigger value="ingredients" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                {t.ingredients}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <Card>
                <CardContent className="p-2">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.description?.[language] || product.description?.en || 'No description available.'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="mt-8">
              <Card>
                <CardContent className="p-2">
                  {product.benefits && product.benefits[language] && product.benefits[language].length > 0 ? (
                    <ul className="space-y-3">
                      {product.benefits[language].map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">
                      {language === 'en' ? t.noBenefits : t.noBenefits}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="mt-8">
              <Card>
                <CardContent className="p-2">
                  {product.usage && product.usage[language] ? (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {product.usage[language]}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      {language === 'en' ? t.noUsageInstructions : t.noUsageInstructions}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-8">
              <Card>
                <CardContent className="p-2">
                  {product.ingredients && product.ingredients[language] ? (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {product.ingredients[language]}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      {language === 'en' ? t.noIngredients : t.noIngredients}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Specifications Section */}
        <div className="mt-8">
          <h2 className="text-2xl text-green-800 mb-6">{t.specifications}</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>{t.category}</span>
                  <span className="capitalize">
                    {product.category?.replace('-', ' ') || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>{t.price}</span>
                  <span>AED {product.price?.toFixed(2)}</span>
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>{t.originalPrice}</span>
                    <span className="line-through text-gray-500">
                      AED {product.originalPrice?.toFixed(2)}
                    </span>
                  </div>
                )}
                {product.discount && product.discount > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="">{t.discount}</span>
                    <span className="text-red-500">
                      {product.discount}%
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>{t.stock}</span>
                  <span className={` ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} ${language === 'en' ? 'in stock' : 'متوفر'}` : t.outOfStock}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>{t.createdAt}</span>
                  <span>
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA')
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>{t.updatedAt}</span>
                  <span>
                    {product.updatedAt
                      ? new Date(product.updatedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}