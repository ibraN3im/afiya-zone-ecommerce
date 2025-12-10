import { useState, useEffect, useRef } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { Star, Grid3x3, List, Search, Filter, ShoppingCart } from 'lucide-react';
import { Input } from './ui/input';
import { productsAPI } from '../services/api';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { useIsMobile } from "./ui/use-mobile";

const translations = {
  en: {
    shop: 'Shop',
    allProducts: 'All Products',
    filters: 'Filters',
    categories: 'Categories',
    priceRange: 'Price Range',
    sortBy: 'Sort By',
    popular: 'Popular',
    priceLowHigh: 'Price:L to H',
    priceHighLow: 'Price:H to L',
    newest: 'Newest',
    sortByRating: 'Rating',
    clearFilters: 'Clear Filters',
    showingResults: 'Showing {count} products',
    noResults: 'No products found',
    addToCart: 'Add to Cart',
    supplements: 'Supplements',
    cosmetics: 'Natural Cosmetics',
    herbal: 'Herbal Products',
    medical: 'Medical Equipment',
    accessories: 'Wellness Accessories',
    searchProducts: 'Search products...',
    loading: 'Loading products...',
    error: 'Failed to load products. Please try again later.',
    retry: 'Retry',
  },
  ar: {
    shop: 'المتجر',
    allProducts: 'جميع المنتجات',
    filters: 'المرشحات',
    categories: 'الفئات',
    priceRange: 'نطاق السعر',
    sortBy: 'ترتيب حسب',
    popular: 'الأكثر شعبية',
    priceLowHigh: 'السعر:الأقل ',
    priceHighLow: 'السعر:لأعلى',
    newest: 'الأحدث',
    sortByRating: 'التقييم',
    clearFilters: 'مسح المرشحات',
    showingResults: 'عرض {count} منتج',
    noResults: 'لم يتم العثور على منتجات',
    addToCart: 'أضف للسلة',
    supplements: 'المكملات الغذائية',
    cosmetics: 'مستحضرات التجميل الطبيعية',
    herbal: 'المنتجات العشبية',
    medical: 'المعدات الطبية',
    accessories: 'إكسسوارات العافية',
    searchProducts: 'البحث عن المنتجات...',
    loading: 'جارٍ تحميل المنتجات...',
    error: 'فشل تحميل المنتجات. يرجى المحاولة لاحقاً.',
    retry: 'إعادة المحاولة',
  },
};

export function Shop() {
  const { language, setCurrentPage, setSelectedProduct, cart, setCart } = useApp();
  const t = translations[language];
  const isMobile = useIsMobile();

  // Product states
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    // Set default view mode to 'list' for mobile devices, 'grid' for desktop
    return isMobile ? 'list' : 'grid';
  });
  // Sync view mode when switching between mobile/desktop
  useEffect(() => {
    setViewMode(isMobile ? 'list' : 'grid');
  }, [isMobile]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  // Polling ref to manage interval
  const pollingRef = useRef<number | null>(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare filters
      const filters: any = {};

      if (selectedCategories.length > 0) {
        // For now, we'll use the first selected category
        // In a more advanced implementation, we could support multiple categories
        filters.category = selectedCategories[0];
      }

      if (priceRange[0] > 0) filters.minPrice = priceRange[0];
      if (priceRange[1] < 100) filters.maxPrice = priceRange[1];
      if (searchQuery) filters.search = searchQuery;
      if (sortBy) filters.sortBy = sortBy;

      const data = await productsAPI.getAll(filters);
      setProducts(Array.isArray(data) ? data : (data.products || []));
    } catch (err: any) {
      setError(err.message || t.error);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Start polling for product updates
  const startPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    // Poll every 30 seconds for updates
    pollingRef.current = window.setInterval(fetchProducts, 30000) as any;
  };

  // Stop polling
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  useEffect(() => {
    fetchProducts();
    startPolling();

    // Cleanup polling on component unmount
    return () => {
      stopPolling();
    };
  }, [selectedCategories, priceRange, sortBy, searchQuery]);

  const categories = [
    { key: 'supplements', label: t.supplements },
    { key: 'cosmetics', label: t.cosmetics },
    { key: 'herbal', label: t.herbal },
    { key: 'medical', label: t.medical },
    { key: 'accessories', label: t.accessories },
  ];

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];


    const matchesSearch = searchQuery === '' ||
      (product.name?.[language] || product.name?.en || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceLowHigh':
        return a.price - b.price;
      case 'priceHighLow':
        return b.price - a.price;
      case 'sortByRating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      default:
        return (b.rating || 0) - (a.rating || 0); // Sort by rating by default
    }
  });

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id
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

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSearchQuery('');
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={fetchProducts}
              className="bg-green-600 hover:bg-green-700"
            >
              {t.retry}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 ">
        {/* Header */}
        <div className="mb-4">
          <h3 className="shop-title">{t.shop}</h3>

          {/* Search Bar */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t.searchProducts}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-green-200 focus:border-green-400"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                {t.showingResults.replace('{count}', sortedProducts.length.toString())}
              </span>

              <div className="flex items-center gap-2 list-view">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center">
              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchProducts}
                disabled={loading}
                className="flex items-center"
              >
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {loading ? (language === 'en' ? 'Refres..' : 'جارٍ...') : (language === 'en' ? 'Refresh' : 'تحديث')}
              </Button>

              {/* Mobile Filter Sheet */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <Filter className="w-4 h-4" />
                  {t.filters}
                </Button>

                {showMobileFilters && (
                  <div className="absolute top-full mt-2 left-0 w-80 mobile-filter z-[60] bg-background border rounded-lg shadow-lg p-4">
                    <div className="space-y-6">
                      {/* Categories */}
                      <div>
                        <h6 className="mb-3">{t.categories}</h6>
                        <div className="space-y-3">
                          {categories.map((category) => (
                            <div key={category.key} className="flex items-center space-x-2">
                              <Checkbox
                                id={category.key}
                                checked={selectedCategories.includes(category.key)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCategories(prev => [...prev, category.key]);
                                  } else {
                                    setSelectedCategories(prev => prev.filter(c => c !== category.key));
                                  }
                                }}
                              />
                              <label
                                htmlFor={category.key}
                                className="text-sm text-gray-700 cursor-pointer"
                              >
                                {category.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h6 className="mb-3">{t.priceRange}</h6>
                        <div className="px-1">
                          <Slider
                            value={priceRange}
                            onValueChange={(value: number[]) => {
                              setPriceRange(value);
                            }}
                            max={100}
                            step={5}
                            className="mb-2"
                          />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>AED {priceRange[0]}</span>
                            <span>AED {priceRange[1]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Clear Filters Button */}
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full text-green-600 border-green-200 hover:bg-green-50"
                      >
                        {t.clearFilters}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Select value={sortBy} onValueChange={setSortBy} >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t.sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">{t.popular}</SelectItem>
                  <SelectItem value="priceLowHigh">{t.priceLowHigh}</SelectItem>
                  <SelectItem value="priceHighLow">{t.priceHighLow}</SelectItem>
                  <SelectItem value="newest">{t.newest}</SelectItem>
                  <SelectItem value="rating">{t.sortByRating}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-1">
          {/* Filters Sidebar - Only shown on desktop */}
          {isMobile === false && (
            <div className="lg:col-span-1">
            </div>
          )}

          {/* Products Grid */}
          <div className={isMobile ? "col-span-full" : "lg:col-span-3"}>
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">{t.noResults}</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'product-grid-container' : 'space-y-4'}>
                {sortedProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`product-grid-item ${viewMode === 'list' ? 'list-view flex flex-row' : ''}`}
                  >
                    <div className="product-image-container flex-shrink-0">
                      {/* Image display with multiple image support */}
                      <div className="relative">
                        <ImageWithFallback
                          src={product.images?.[0] || '/placeholder-product.jpg'}
                          alt={product.name?.[language] || product.name?.en || 'Product'}
                          className={`product-image ${viewMode === 'list'
                            ? 'w-48 h-48 rounded-l-lg'
                            : 'w-full h-48 rounded-t-lg'
                            }`}
                          onClick={() => viewProduct(product)}
                        />
                        {/* Show indicator if product has multiple images */}
                        {product.images && product.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 text-green text-xs px-2 py-1 rounded flex items-center">
                            <span>{product.images.length}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}

                        {/* Preview of additional images */}
                        {product.images && product.images.length > 1 && viewMode === 'grid' && (
                          <div className="absolute bottom-2 left-2 flex space-x-1">
                            {product.images.slice(1, 4).map((image: string, idx: number) => (
                              <div key={idx} className="w-6 h-6 rounded border-2 border-white shadow">
                                <ImageWithFallback
                                  src={image}
                                  alt={`${product.name?.[language] || product.name?.en || 'Product'} preview ${idx + 1}`}
                                  className="w-full h-full object-cover rounded"
                                  onClick={() => viewProduct(product)}

                                />
                              </div>
                            ))}
                            {product.images.length > 4 && (
                              <div className="w-6 h-6 rounded bg-black bg-opacity-50 text-white text-xs flex items-center justify-center border-2 border-white">
                                +{product.images.length - 4}

                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {product.isNew && (
                        <div className="product-badge">
                          {language === 'en' ? 'New' : 'جديد'}
                        </div>
                      )}
                      {product.discount && product.discount > 0 && (
                        <div className="product-discount-badge">
                          -{product.discount}%
                        </div>
                      )}
                    </div>

                    {viewMode === 'list' && (
                      <div className="product-info flex flex-col justify-between flex-1">
                        <div>
                          <h4
                            className="product-title"
                            onClick={() => viewProduct(product)}
                          >
                            {product.name?.[language] || product.name?.en || 'Unnamed Product'}
                          </h4>
                          <div className="product-description">
                            {product.description?.[language] || product.description?.en || 'No description available'}
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
                                  onClick={() => handleRatingClick(product._id, i + 1)}
                                />
                              ))}
                            </div>
                            <span className="rating-count">
                              {product.rating?.toFixed(1) || '0.0'}
                            </span>
                          </div>

                          <div className="product-price">
                            AED {product.price?.toFixed(2)}
                            {product.originalPrice && product.originalPrice > product.price && (
                              <small className="original-price">
                                AED {product.originalPrice?.toFixed(2)}
                              </small>
                            )}
                          </div>
                        </div>


                        <button
                          className="add-to-cart-btn w-full"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0
                            ? (language === 'en' ? 'Out of Stock' : 'غير متوفر')
                            : <ShoppingCart className="w-5 h-5" />}
                        </button>

                      </div>
                    )}

                    {viewMode === 'grid' && (
                      <div className="product-info flex flex-col justify-between">
                        <div className="p-4">
                          <h4
                            className="product-title"
                            onClick={() => viewProduct(product)}
                          >
                            {product.name?.[language] || product.name?.en || 'Unnamed Product'}
                          </h4>

                          <div className="product-description">
                            {product.description?.[language] || product.description?.en || 'No description available'}
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
                                  onClick={() => handleRatingClick(product._id, i + 1)}
                                />
                              ))}
                            </div>
                            <span className="rating-count">
                              {product.rating?.toFixed(1) || '0.0'}
                            </span>
                          </div>

                          <div className="product-price">
                            AED {product.price?.toFixed(2)}
                            {product.originalPrice && product.originalPrice > product.price && (
                              <small className="original-price">
                                AED {product.originalPrice?.toFixed(2)}
                              </small>
                            )}
                          </div>
                        </div>


                        <button
                          className="add-to-cart-btn w-full"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0
                            ? (language === 'en' ? 'Out of Stock' : 'غير متوفر')
                            : <ShoppingCart className="w-5 h-5" />}
                        </button>

                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}