import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { ShoppingCart, User, Menu, Globe } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

interface Translation {
  language: string;
  login: string;
  about: string;
  contact: string;
  cart: string;
  account: string;
  supplements: string;
  cosmetics: string;
  herbal: string;
  accessories: string;
}

const translations: Record<'en' | 'ar', Translation> = {
  en: {
    language: 'Language',
    login: 'Login',
    about: 'About Us',
    contact: 'Contact',
    cart: 'Cart',
    account: 'Account',
    supplements: 'Supplements',
    cosmetics: 'Natural Cosmetics',
    herbal: 'Herbal Products',
    accessories: 'Wellness Accessories',
  },
  ar: {
    language: 'اللغة',
    login: 'تسجيل الدخول',
    about: 'من نحن',
    contact: 'اتصل بنا',
    cart: 'السلة',
    account: 'حسابي',
    supplements: 'المكملات الغذائية',
    cosmetics: 'مستحضرات التجميل الطبيعية',
    herbal: 'المنتجات العشبية',
    accessories: 'إكسسوارات العافية',
  },
};

export function Header() {
  const { currentPage, setCurrentPage, language, user, cart, setShowLoginModal, setLanguage } = useApp();
  const t = translations[language];

  // Calculate cart items count
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-green-100/95 backdrop-blur-sm border-b border-green-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
             <img
              src="https://i.imgur.com/HDmpMTk.jpeg"
              alt="Afiya Zone Logo"
              className="w-10 h-10 rounded-full mr-3 object-contain logo"
            /> 
            <h1 className="text-xl text-green-600 tracking-wide afiya-title">Afiya Zone</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 pc-nav">

            <button
              onClick={() => setCurrentPage('about')}
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              {t.about}
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              {t.contact}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className=" sm:flex items-center space-x-1 text-gray-600 hover:text-green-700"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'AR' : 'EN'}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => user ? setCurrentPage('account') : setShowLoginModal(true)}
              className="sm:flex items-center space-x-1 text-gray-600 hover:text-green-700"
            >
              <User className="w-4 h-4" />
              <span>{user ? user.name?.split(' ')[0] : t.account}</span>
            </Button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-green-700"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'AR' : 'EN'}</span>
            </Button>

            {/* Notifications */}
            {user && <NotificationBell />}

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage('cart')}
              className="relative text-green-600 hover:text-green-700"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute cart-counter bg-green-500 text-white text-xs min-w-[1.2rem] h-5 flex items-center justify-center">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => user ? setCurrentPage('account') : setShowLoginModal(true)}
              className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-green-700"
            >
              <User className="w-4 h-4" />
              <span>{user ? user.name?.split(' ')[0] : t.account}</span>
            </Button>


            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'ar' ? 'left' : 'right'} className="mobile-sidebar">
                <div className="flex flex-col space-y-4">

                  {/* Mobile Navigation */}
                  <div className="border-t space-y-2 mobile-sidebar-btns">

                    <button
                      onClick={() => setCurrentPage('about')}
                      className="w-full text-left px-4 py-3 hover:text-green-700 hover:bg-gray-50"
                    >
                      {t.about}
                    </button>

                    <button
                      onClick={() => setCurrentPage('contact')}
                      className="w-full text-left px-4 py-3 hover:text-green-700 hover:bg-gray-50"
                    >
                      {t.contact}
                    </button>

                    <button
                      onClick={() => user ? setCurrentPage('account') : setShowLoginModal(true)}
                      className="w-full text-left px-4 py-3 hover:text-green-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      {user ? user.name?.split(' ')[0] : t.account}
                    </button>

                    <button
                      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                      className="w-full text-left px-4 py-3 hover:text-green-700 hover:bg-gray-50"
                    >
                      <Globe className="w-4 h-4 inline mr-2" />
                      {language === 'en' ? 'العربية' : 'English'}
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
