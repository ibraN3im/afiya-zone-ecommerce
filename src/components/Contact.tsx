import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { messagesAPI } from '../services/api';

const translations = {
  en: {
    contact: 'Contact Us',
    getInTouch: 'Get in Touch',
    getInTouchDesc: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    subject: 'Subject',
    message: 'Message',
    selectSubject: 'Select a subject',
    generalInquiry: 'General Inquiry',
    productQuestion: 'Product Question',
    orderSupport: 'Order Support',
    wholesale: 'Wholesale Inquiry',
    partnership: 'Partnership Opportunity',
    feedback: 'Feedback & Suggestions',
    sendMessage: 'Send Message',
    sending: 'Sending...',
    messageSent: 'Message sent successfully! We\'ll get back to you soon.',
    contactInfo: 'Contact Information',
    address: 'Address',
    addressValue: 'Corniche street\nKhaliha, Abu Dhabi, UAE',
    phoneValue: '+971 55 123 4567',
    emailValue: 'info@afiyazone.com',
    businessHours: 'Business Hours',
    hoursValue: 'Sunday - Thursday: 9:00 AM - 8:00 PM\nFriday - Saturday: 10:00 AM - 6:00 PM',
    followUs: 'Follow Us',
    followDesc: 'Stay connected for wellness tips, product updates, and special offers.',
    faq: 'Frequently Asked Questions',
    faqDesc: 'Find answers to common questions about our products and services.',
    viewFaq: 'View FAQ',
    support: 'Customer Support',
    supportDesc: 'Need immediate help? Our support team is here for you.',
    // liveChat: 'Start Live Chat',
    // whatsapp: 'WhatsApp Support',
  },
  ar: {
    contact: 'تواصل معنا',
    getInTouch: 'تواصل معنا',
    getInTouchDesc: 'نحب أن نسمع منك. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن.',
    name: 'الاسم الكامل',
    email: 'عنوان البريد الإلكتروني',
    phone: 'رقم الهاتف',
    subject: 'الموضوع',
    message: 'الرسالة',
    selectSubject: 'اختر موضوع',
    generalInquiry: 'استفسار عام',
    productQuestion: 'سؤال حول المنتج',
    orderSupport: 'دعم الطلبات',
    wholesale: 'استفسار الجملة',
    partnership: 'فرصة شراكة',
    feedback: 'تعليقات واقتراحات',
    sendMessage: 'إرسال الرسالة',
    sending: 'جاري الإرسال...',
    messageSent: 'تم إرسال الرسالة بنجاح! سنعود إليك قريباً.',
    contactInfo: 'معلومات التواصل',
    address: 'العنوان',
    addressValue: 'شارع الكورنيش ,الخالدية, أبو ظبي, الإمارات العربية المتحدة',
    phoneValue: '+971 55 123 4567',
    emailValue: 'info@afiyazone.com',
    businessHours: 'ساعات العمل',
    hoursValue: 'الأحد - الخميس: 9:00 ص - 8:00 م\nالجمعة - السبت: 10:00 ص - 6:00 م',
    followUs: 'تابعنا',
    followDesc: 'ابق على تواصل للحصول على نصائح العافية وتحديثات المنتجات والعروض الخاصة.',
    faq: 'الأسئلة الشائعة',
    faqDesc: 'اعثر على إجابات للأسئلة الشائعة حول منتجاتنا وخدماتنا.',
    viewFaq: 'عرض الأسئلة الشائعة',
    support: 'دعم العملاء',
    supportDesc: 'تحتاج مساعدة فورية؟ فريق الدعم لدينا هنا من أجلك.',
    // liveChat: 'بدء محادثة مباشرة',
    // whatsapp: 'دعم واتساب',
  },
};

export function Contact() {
  const { language } = useApp();
  const t = translations[language];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error(language === 'ar' ? 'يرجى إدخال الاسم والبريد والرسالة' : 'Please fill in name, email, and message');
      return;
    }

    try {
      setIsSubmitting(true);
      await messagesAPI.send(contactForm);
      toast.success(t.messageSent);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      toast.error(error.message || (language === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const socialLinks = [
    { icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { icon: Youtube, href: '#', color: 'hover:text-red-600' },
  ];

  const subjectOptions = [
    { value: 'general', label: t.generalInquiry },
    { value: 'product', label: t.productQuestion },
    { value: 'order', label: t.orderSupport },
    { value: 'wholesale', label: t.wholesale },
    { value: 'partnership', label: t.partnership },
    { value: 'feedback', label: t.feedback },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl text-green-800 mb-6">{t.contact}</h1>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t.getInTouchDesc}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-green-100 shadow-lg">
              <CardHeader>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.name}</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border-green-200 focus:border-green-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="border-green-200 focus:border-green-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="border-green-200 focus:border-green-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t.subject}</Label>
                      <Select value={contactForm.subject} onValueChange={(value: string) => handleInputChange('subject', value)}>
                        <SelectTrigger className="border-green-200 focus:border-green-400">
                          <SelectValue placeholder={t.selectSubject} />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t.message}</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={contactForm.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="border-green-200 focus:border-green-400 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        {t.sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {t.sendMessage}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-xl text-green-800">{t.contactInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 mb-1">{t.address}</p>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{t.addressValue}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-green-800">{t.phoneValue}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-green-800">{t.emailValue}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 mb-1">{t.businessHours}</p>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{t.hoursValue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-xl text-green-800">{t.followUs}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{t.followDesc}</p>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      title={social.icon.displayName || social.icon.name}
                      className={`w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 transition-colors ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}

            {/* <Card className="border-green-100"> */}
            {/* <CardHeader>
                <CardTitle className="text-xl text-green-800">{t.support}</CardTitle>
              </CardHeader> */}
            {/* <CardContent className="space-y-4"> */}
            {/* <p className="text-gray-600 text-sm">{t.supportDesc}</p> */}

            {/* <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t.liveChat}
                </Button> */}

            {/* <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t.whatsapp}
                </Button> */}
            {/* </CardContent>
            </Card> */}

            {/* FAQ */}
            {/* <Card className="border-green-100"> */}
            {/* <CardHeader>
                <CardTitle className="text-xl text-green-800">{t.faq}</CardTitle>
              </CardHeader> */}
            {/* <CardContent>
                <p className="text-gray-600 text-sm mb-4">{t.faqDesc}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  {t.viewFaq}
                </Button>
              </CardContent> */}
            {/* </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
}