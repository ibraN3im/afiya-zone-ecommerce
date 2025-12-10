import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ordersAPI } from '../services/api';

const translations = {
  en: {
    checkout: 'Checkout',
    backToCart: 'Back to Cart',
    shippingAddress: 'Shipping Address',
    billingAddress: 'Billing Address',
    sameAsShipping: 'Same as shipping address',
    paymentMethod: 'Payment Method',
    orderSummary: 'Order Summary',
    deliveryOptions: 'Delivery Options',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    state: 'State/Province',
    zipCode: 'ZIP/Postal Code',
    country: 'Country',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    cardholderName: 'Cardholder Name',
    paypal: 'PayPal',
    creditCard: 'Credit/Debit Card',
    applePay: 'Apple Pay',
    standardShipping: 'Standard Shipping (5-7 days)',
    expressShipping: 'Express Shipping (2-3 days)',
    overnightShipping: 'Overnight Shipping (1 day)',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    total: 'Total',
    placeOrder: 'Place Order',
    processing: 'Processing...',
    orderSuccess: 'Order placed successfully!',
    secureCheckout: 'Secure Checkout',
    free: 'Free',
    items: 'items',
    estimatedDelivery: 'Estimated Delivery',
    saudi: 'Saudi Arabia',
    uae: 'United Arab Emirates',
    kuwait: 'Kuwait',
    qatar: 'Qatar',
    bahrain: 'Bahrain',
    oman: 'Oman',
  },
  ar: {
    checkout: 'إتمام الطلب',
    backToCart: 'العودة للسلة',
    shippingAddress: 'عنوان الشحن',
    billingAddress: 'عنوان الفوترة',
    sameAsShipping: 'نفس عنوان الشحن',
    paymentMethod: 'طريقة الدفع',
    orderSummary: 'ملخص الطلب',
    deliveryOptions: 'خيارات التوصيل',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    address: 'العنوان',
    city: 'المدينة',
    state: 'المنطقة/المحافظة',
    zipCode: 'الرمز البريدي',
    country: 'البلد',
    cardNumber: 'رقم البطاقة',
    expiryDate: 'تاريخ الانتهاء',
    cvv: 'رمز التحقق',
    cardholderName: 'اسم حامل البطاقة',
    paypal: 'باي بال',
    creditCard: 'بطاقة ائتمان/خصم',
    applePay: 'آبل باي',
    standardShipping: 'الشحن العادي (5-7 أيام)',
    expressShipping: 'الشحن السريع (2-3 أيام)',
    overnightShipping: 'الشحن الفوري (يوم واحد)',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    tax: 'الضريبة',
    total: 'المجموع',
    placeOrder: 'تأكيد الطلب',
    processing: 'جاري المعالجة...',
    orderSuccess: 'تم تأكيد الطلب بنجاح!',
    secureCheckout: 'دفع آمن',
    free: 'مجاني',
    items: 'عناصر',
    estimatedDelivery: 'التوصيل المتوقع',
    saudi: 'المملكة العربية السعودية',
    uae: 'الإمارات العربية المتحدة',
    kuwait: 'الكويت',
    qatar: 'قطر',
    bahrain: 'البحرين',
    oman: 'عمان',
  },
};

export function Checkout() {
  const { language, setCurrentPage, cart, setCart, user } = useApp();
  const t = translations[language];

  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express' | 'overnight'>('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const [shippingForm, setShippingForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'saudi',
  });

  const [billingForm, setBillingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'saudi',
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const deliveryOptions = {
    standard: { price: subtotal > 50 ? 0 : 9.99, days: '5-7' },
    express: { price: 19.99, days: '2-3' },
    overnight: { price: 39.99, days: '1' },
  } as const;

  const getShippingOptionLabel = (key: keyof typeof deliveryOptions) => {
    switch (key) {
      case 'standard':
        return t.standardShipping;
      case 'express':
        return t.expressShipping;
      case 'overnight':
        return t.overnightShipping;
      default:
        return '';
    }
  };

  const shippingCost = deliveryOptions[deliveryOption].price;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const countries = [
    { key: 'saudi', label: t.saudi },
    { key: 'uae', label: t.uae },
    { key: 'kuwait', label: t.kuwait },
    { key: 'qatar', label: t.qatar },
    { key: 'bahrain', label: t.bahrain },
    { key: 'oman', label: t.oman },
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Check if user is logged in
      if (!user) {
        toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
        setCurrentPage('home');
        setIsProcessing(false);
        return;
      }

      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || item.images?.[0]
        })),
        shippingAddress: {
          fullName: `${shippingForm.firstName} ${shippingForm.lastName}`,
          phone: shippingForm.phone,
          address: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          zipCode: shippingForm.zipCode,
          country: shippingForm.country
        },
        paymentMethod: paymentMethod === 'credit' ? 'credit_card' : paymentMethod === 'paypal' ? 'bank_transfer' : 'cash_on_delivery',
        subtotal: subtotal,
        shipping: shippingCost,
        tax: tax,
        total: total,
        notes: `Delivery: ${deliveryOption}`
      };

      // Send order to API
      const response = await ordersAPI.create(orderData);

      // Clear cart and show success
      setCart([]);
      toast.success(t.orderSuccess + ` (${response.orderNumber})`);
      setCurrentPage('account'); // Redirect to account to show order history
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || (language === 'ar' ? 'حدث خطأ أثناء إنشاء الطلب' : 'Error creating order'));
    } finally {
      setIsProcessing(false);
    }
  };

  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDays = deliveryOption === 'standard' ? 7 : deliveryOption === 'express' ? 3 : 1;
    const deliveryDate = new Date(today.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
    return deliveryDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('cart')}
            className="mr-4 text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToCart}
          </Button>
          <h1 className="text-3xl text-green-800">{t.checkout}</h1>
          <div className="ml-4 flex items-center text-green-600">
            <Shield className="w-5 h-5 mr-1" />
            <span className="text-sm">{t.secureCheckout}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    {t.shippingAddress}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shipping-first-name">{t.firstName}</Label>
                      <Input
                        id="shipping-first-name"
                        value={shippingForm.firstName}
                        onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping-last-name">{t.lastName}</Label>
                      <Input
                        id="shipping-last-name"
                        value={shippingForm.lastName}
                        onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shipping-email">{t.email}</Label>
                      <Input
                        id="shipping-email"
                        type="email"
                        value={shippingForm.email}
                        onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping-phone">{t.phone}</Label>
                      <Input
                        id="shipping-phone"
                        type="tel"
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="shipping-address">{t.address}</Label>
                    <Input
                      id="shipping-address"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="shipping-city">{t.city}</Label>
                      <Input
                        id="shipping-city"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping-state">{t.state}</Label>
                      <Input
                        id="shipping-state"
                        value={shippingForm.state}
                        onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping-zip">{t.zipCode}</Label>
                      <Input
                        id="shipping-zip"
                        value={shippingForm.zipCode}
                        onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="shipping-country">{t.country}</Label>
                    <Select value={shippingForm.country} onValueChange={(value) => setShippingForm({ ...shippingForm, country: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.key} value={country.key}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">{t.deliveryOptions}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                    <div className="space-y-3">
                      {Object.entries(deliveryOptions).map(([key, option]) => (
                        <div key={key} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value={key} id={key} />
                          <div className="flex-1">
                            <Label htmlFor={key} className="cursor-pointer">
                              <div className="flex justify-between items-center">
                                <span>{getShippingOptionLabel(key as keyof typeof deliveryOptions)}</span>
                                <span className={option.price === 0 ? 'text-green-600' : ''}>
                                  {option.price === 0 ? t.free : `AED ${option.price.toFixed(2)}`}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {t.estimatedDelivery}: {getEstimatedDelivery()}
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    {t.paymentMethod}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="cursor-pointer flex-1">
                          {t.creditCard}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="cursor-pointer flex-1">
                          {t.paypal}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value="apple" id="apple" />
                        <Label htmlFor="apple" className="cursor-pointer flex-1">
                          {t.applePay}
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'credit' && (
                    <div className="mt-4 space-y-4 p-4 border rounded-lg bg-gray-50">
                      <div>
                        <Label htmlFor="card-number">{t.cardNumber}</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={paymentForm.cardNumber}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="expiry">{t.expiryDate}</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={paymentForm.expiryDate}
                            onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">{t.cvv}</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentForm.cvv}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardholder">{t.cardholderName}</Label>
                        <Input
                          id="cardholder"
                          value={paymentForm.cardholderName}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardholderName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-green-800">{t.orderSummary}</CardTitle>
                  <p className="text-gray-600 text-sm">
                    {totalItems} {t.items}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={item.image || item.images?.[0]}
                          alt={item.name[language]}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-green-800 truncate">
                            {item.name[language]}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} × AED {item.price}
                          </p>
                        </div>
                        <p className="text-sm">AED {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Order Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.subtotal}</span>
                      <span>AED {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.shipping}</span>
                      <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                        {shippingCost === 0 ? t.free : `AED ${shippingCost.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.tax}</span>
                      <span>AED {tax.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-green-800">{t.total}</span>
                      <span className="text-xl text-green-700">AED {total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        {t.processing}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {t.placeOrder}
                      </>
                    )}
                  </Button>

                  {/* Security Notice */}
                  <div className="text-center text-xs text-gray-500 mt-4">
                    🔒 Your payment information is secure and encrypted
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}