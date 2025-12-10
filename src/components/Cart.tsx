import React from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const translations = {
  en: {
    cart: 'Shopping Cart',
    emptyCart: 'Your cart is empty',
    emptyCartDesc: 'Add some products to get started',
    continueShopping: 'Continue Shopping',
    quantity: 'Quantity',
    remove: 'Remove',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    free: 'Free',
    itemRemoved: 'Item removed from cart',
    updateQuantity: 'Quantity updated',
    backToShop: 'Back to Shop',
    cartSummary: 'Cart Summary',
    items: 'items',
    estimatedTotal: 'Estimated Total',
  },
  ar: {
    cart: 'سلة التسوق',
    emptyCart: 'سلة التسوق فارغة',
    emptyCartDesc: 'أضف بعض المنتجات للبدء',
    continueShopping: 'متابعة التسوق',
    quantity: 'الكمية',
    remove: 'إزالة',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    tax: 'الضريبة',
    total: 'المجموع',
    checkout: 'المتابعة للدفع',
    free: 'مجاني',
    itemRemoved: 'تم إزالة العنصر من السلة',
    updateQuantity: 'تم تحديث الكمية',
    backToShop: 'العودة للمتجر',
    cartSummary: 'ملخص السلة',
    items: 'عناصر',
    estimatedTotal: 'المجموع المقدر',
  },
};

export function Cart() {
  const { language, setCurrentPage, cart, setCart } = useApp();
  const t = translations[language];

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
    toast.success(t.updateQuantity);
  };

  const removeItem = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.success(t.itemRemoved);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-12 h-12 text-green-600" />
          </div>
          <div>
            <h5 className="text-2xl text-green-800 mb-2">{t.emptyCart}</h5>
            <p className="text-gray-600">{t.emptyCartDesc}</p>
          </div>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setCurrentPage('shop')}
          >
            {t.continueShopping}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('shop')}
            className="mr-4 text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToShop}
          </Button>
          <h6 className="text-3xl text-green-600">{t.cart}</h6>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="cart-cart">
                <div className="p-2 shopping-cart items-center">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <ImageWithFallback
                      src={item.image || item.images?.[0]}
                      alt={item.name[language]}
                      className="w-64 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h6 className="product-name text-lg text-green-600 mb-1">
                      {item.name[language]}
                    </h6>
                    <div className="price text-gray-600 text-sm mb-2">
                      AED {item.price} each
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div>
                        <span className="text-sm text-gray-600">{t.quantity}:</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="flex items-center justify-between text-right">
                      <p className="price text-lg text-green-700 mb-2">
                        AED {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {t.remove}
                      </Button>
                    </div>
                  </div>

                </div>
              </Card>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="cart-summary cart-cart border-green-100 sticky top-24">
              <CardHeader>
                <h6 className="text-green-600">{t.cartSummary}</h6>
                <p className="text-gray-600 text-sm">
                  {totalItems} {t.items}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">{t.subtotal}</span>
                    <span className="text-sm">AED {subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm">{t.shipping}</span>
                    <span className={shipping === 0 ? 'text-sm text-gray-600' : 'text-sm'}>
                      {shipping === 0 ? t.free : `AED ${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm">{t.tax}</span>
                    <span className="text-sm text-gray-600">AED {tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-green-600">{t.total}</span>
                      <span className="text-green-600">AED {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {shipping > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700">
                      Add AED {(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <div className='flex justify-between'>
                  <Button
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                    onClick={() => setCurrentPage('checkout')}
                  >
                    {t.checkout}
                  </Button>

                  {/* Continue Shopping */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => setCurrentPage('shop')}
                  >
                    {t.continueShopping}
                  </Button>
                </div>
                {/* Security Notice */}
                <small className="text-center text-gray-500 mt-4">
                  🔒 Secure checkout guaranteed
                </small>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}