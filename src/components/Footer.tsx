import { useApp } from '../App';
import { Separator } from './ui/separator';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Heart, Leaf } from 'lucide-react';

const translations = {
  en: {
    newsletter: 'Newsletter',
    newsletterDesc: 'Subscribe to get wellness tips and exclusive offers',
    enterEmail: 'Enter your email',
    subscribe: 'Subscribe',
    quickLinks: 'Quick Links',
    home: 'Home',
    shop: 'Shop',
    about: 'About Us',
    contact: 'Contact',
    supplements: 'Supplements',
    cosmetics: 'Natural Cosmetics',
    herbal: 'Herbal Products',
    medical: 'Medical Equipment',
    accessories: 'Wellness Accessories',
    customerService: 'Customer Service',
    faq: 'FAQ',
    shipping: 'Shipping Info',
    returns: 'Returns & Exchanges',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    sizeGuide: 'Size Guide',
    contactUs: 'Contact Us',
    address: 'Abu Dhabi-Al Khalidiya- Corniche - United Arab Emirates',
    phone: '+917 544 652 270',
    email: 'ibra12466@gmail.com',
    followUs: 'Follow Us',
    paymentMethods: 'Payment Methods',
    securePayment: 'Secure Payment',
    madeWith: 'Made with',
    in: 'in',
    location: 'United Arab Emirates',
    allRights: 'All rights reserved.',
    company: 'Afiya Zone',
    year: '2025',
    wellness: 'Your trusted wellness partner',
  },
  ar: {
    newsletter: 'النشرة الإخبارية',
    newsletterDesc: 'اشترك للحصول على نصائح العافية والعروض الحصرية',
    enterEmail: 'أدخل بريدك الإلكتروني',
    subscribe: 'اشترك',
    quickLinks: 'روابط سريعة',
    home: 'الرئيسية',
    shop: 'المتجر',
    about: 'من نحن',
    contact: 'تواصل معنا',
    supplements: 'المكملات الغذائية',
    cosmetics: 'مستحضرات التجميل الطبيعية',
    herbal: 'المنتجات العشبية',
    medical: 'المعدات الطبية',
    accessories: 'إكسسوارات العافية',
    customerService: 'خدمة العملاء',
    faq: 'الأسئلة الشائعة',
    shipping: 'معلومات الشحن',
    returns: 'الإرجاع والاستبدال',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    sizeGuide: 'دليل المقاسات',
    contactUs: 'اتصل بنا',
    address: ' أبو ظبي-الخالدية- شارع الكورنيش - الإمارات العربية المتحدة',
    phone: '+917 544 652 270',
    email: 'ibra12466@gmail.com',
    followUs: 'تابعنا',
    paymentMethods: 'طرق الدفع',
    securePayment: 'دفع آمن',
    allRights: 'جميع الحقوق محفوظة',
    company: 'Afiya Zone',
    year: '2025',
    wellness: 'Your trusted wellness partner in the UAE',
  },
};

export function Footer() {
  const { language, setCurrentPage } = useApp();
  const t = translations[language];

  const quickLinks = [
    { key: 'home', label: t.home, action: () => setCurrentPage('home') },
    { key: 'shop', label: t.shop, action: () => setCurrentPage('shop') },
    { key: 'about', label: t.about, action: () => setCurrentPage('about') },
    { key: 'contact', label: t.contact, action: () => setCurrentPage('contact') },
  ];

  const categories = [
    { label: t.supplements, action: () => setCurrentPage('shop') },
    { label: t.cosmetics, action: () => setCurrentPage('shop') },
    { label: t.herbal, action: () => setCurrentPage('shop') },
    { label: t.medical, action: () => setCurrentPage('shop') },
    { label: t.accessories, action: () => setCurrentPage('shop') },
  ];

  const customerService = [
    { label: t.faq, action: () => { } },
    { label: t.shipping, action: () => { } },
    { label: t.returns, action: () => { } },
    { label: t.privacy, action: () => { } },
    { label: t.terms, action: () => { } },
    { label: t.sizeGuide, action: () => { } },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { icon: Youtube, href: '#', color: 'hover:text-red-500' },
  ];

  return (
    <footer >
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info & Newsletter */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              {/* Logo */}
              {/* <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center mr-3">
                  <img 
                    src="/src/logo/afiya-logo.jpg" 
                    alt="Afiya Zone Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl tracking-wide">Afiya Zone</h3>
                  <p className="text-green-200 text-sm">{t.wellness}</p>
                </div>
              </div> */}

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <p className="location-title">{t.address}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-300 flex-shrink-0" />
                  <p className="tel-title">{t.phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-300 flex-shrink-0" />
                  <p className="email-title">{t.email}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg mb-6">{t.quickLinks}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-green-200 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>


          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg mb-6">{t.customerService}</h4>
            <ul className="space-y-3">
              {customerService.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={service.action}
                    className="text-green-200 hover:text-white transition-colors text-sm"
                  >
                    {service.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Payment */}
          <div>
            <h4 className="text-lg mb-6">{t.followUs}</h4>
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-green-200 transition-colors ${social.color}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <h4 className="text-lg mb-6">{t.paymentMethods}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
                  <span className="text-xs text-gray-800 font-medium">VISA</span>
                </div>
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
                  <span className="text-xs text-gray-800 font-medium">MC</span>
                </div>
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-xs text-white font-medium">PP</span>
                </div>
              </div>
              <p className="text-green-200 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                {t.securePayment}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="text-center lg:text-left">
            <p className="text-green-200 text-sm">
              © {t.year} {t.company} | {t.allRights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}