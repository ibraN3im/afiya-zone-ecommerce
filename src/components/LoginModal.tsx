import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '../services/api';

const translations = {
  en: {
    welcome: 'Welcome to Afiya Zone',
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone Number',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    loginSuccess: 'Welcome back!',
    registerSuccess: 'Account created successfully!',
    invalidCredentials: 'Invalid email or password',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    passwordMismatch: 'Passwords do not match',
    nameRequired: 'Name is required',
    phoneRequired: 'Phone number is required',
    termsAccept: 'I accept the Terms and Conditions',
    newsletter: 'Subscribe to our newsletter for wellness tips',
    close: 'Close',
    resetPassword: 'Reset Password',
    sendResetLink: 'Reset',
    backToLogin: 'Back to Login',
    checkEmail: 'Check your email for a reset link',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    setPassword: 'Set New Password',
    passwordResetSuccess: 'Password reset successfully!',
    invalidResetToken: 'Invalid or expired reset token',
  },
  ar: {
    welcome: 'مرحباً بك في عافيه العافية',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    phone: 'رقم الهاتف',
    forgotPassword: 'نسيت كلمة المرور؟',
    noAccount: 'ليس لديك حساب؟',
    hasAccount: 'لديك حساب بالفعل؟',
    signUp: 'إنشاء حساب',
    signIn: 'تسجيل الدخول',
    createAccount: 'إنشاء الحساب',
    loginSuccess: 'مرحباً بعودتك!',
    registerSuccess: 'تم إنشاء الحساب بنجاح!',
    invalidCredentials: 'بريد إلكتروني أو كلمة مرور غير صحيحة',
    emailRequired: 'البريد الإلكتروني مطلوب',
    passwordRequired: 'كلمة المرور مطلوبة',
    passwordMismatch: 'كلمة المرور غير متطابقة',
    nameRequired: 'الاسم مطلوب',
    phoneRequired: 'رقم الهاتف مطلوب',
    termsAccept: 'أوافق على الشروط والأحكام',
    newsletter: 'اشترك في نشرتنا الإخبارية للحصول على نصائح العافية',
    close: 'إغلاق',
    resetPassword: 'إعادة تعيين كلمة المرور',
    sendResetLink: 'إرسال رابط إعادة التعيين',
    backToLogin: 'العودة للتسجيل',
    checkEmail: 'تحقق من بريدك الإلكتروني للحصول على رابط إعادة التعيين',
    newPassword: 'كلمة المرور الجديدة',
    confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
    setPassword: 'تعيين كلمة المرور الجديدة',
    passwordResetSuccess: 'تمت إعادة تعيين كلمة المرور بنجاح!',
    invalidResetToken: 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية',
  },
};

export function LoginModal() {
  const { language, showLoginModal, setShowLoginModal, setUser } = useApp();
  const t = translations[language];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [resetToken, setResetToken] = useState('');

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false,
  });

  // Forgot password form state
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: '',
  });

  // Reset password form state
  const [resetPasswordForm, setResetPasswordForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!loginForm.email) {
      toast.error(t.emailRequired);
      setIsLoading(false);
      return;
    }
    if (!loginForm.password) {
      toast.error(t.passwordRequired);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authAPI.login(loginForm);

      setUser(data.user);
      try {
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (e) {
        // ignore
      }
      setShowLoginModal(false);
      toast.success(`${t.loginSuccess} ${t.welcome}, ${data.user.name}!`);

      // Reset form
      setLoginForm({ email: '', password: '' });
    } catch (error: any) {
      toast.error(error.message || t.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  };



  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!registerForm.firstName || !registerForm.lastName) {
      toast.error(t.nameRequired);
      setIsLoading(false);
      return;
    }
    if (!registerForm.email) {
      toast.error(t.emailRequired);
      setIsLoading(false);
      return;
    }
    if (!registerForm.phone) {
      toast.error(t.phoneRequired);
      setIsLoading(false);
      return;
    }
    if (!registerForm.password) {
      toast.error(t.passwordRequired);
      setIsLoading(false);
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error(t.passwordMismatch);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authAPI.register({
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
        newsletter: registerForm.newsletter,
      });

      setUser(data.user);
      try {
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (e) {
        // ignore
      }
      setShowLoginModal(false);
      toast.success(`${t.registerSuccess} ${t.welcome}, ${data.user.name}!`);

      // Reset form
      setRegisterForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        newsletter: false,
      });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!forgotPasswordForm.email) {
      toast.error(t.emailRequired);
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.forgotPassword(forgotPasswordForm.email);
      toast.success(t.checkEmail);
      setAuthMode('login');

      // Reset form
      setForgotPasswordForm({ email: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!resetPasswordForm.password) {
      toast.error(t.passwordRequired);
      setIsLoading(false);
      return;
    }
    if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
      toast.error(t.passwordMismatch);
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.resetPassword(resetToken, resetPasswordForm.password);
      toast.success(t.passwordResetSuccess);
      setAuthMode('login');

      // Reset form
      setResetPasswordForm({ password: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || t.invalidResetToken);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth callback
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');

    if (token && user) {
      localStorage.setItem('authToken', token);
      const parsedUser = JSON.parse(decodeURIComponent(user));
      setUser(parsedUser);
      try {
        localStorage.setItem('user', JSON.stringify(parsedUser));
      } catch (e) {
        // ignore
      }
      setShowLoginModal(false);
      toast.success(`${t.loginSuccess} ${t.welcome}!`);

      // Remove query parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setUser, setShowLoginModal, t]);

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="login-form w-full rounded-lg">
        {/* <DialogHeader>
          <DialogTitle className="text-center text-green-800">
            {t.welcome}
          </DialogTitle>
        </DialogHeader> */}

        {authMode === 'login' && (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="log-res-tabs w-full">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                {t.login}
              </TabsTrigger>

              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                {t.register}
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <div className="text-center">
                      <User className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className='login-card'>
                      <div className="email-password">
                        <div className="space-y-2 ">
                          <Label htmlFor="login-email">{t.email}</Label>
                          <div className="relative">
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="example@gmail.com"
                              value={loginForm.email}
                              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="login-password">{t.password}</Label>
                          <div className="relative">
                            {/* <Lock className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /> */}
                            <Input
                              id="login-password"
                              type={showPassword ? 'text' : 'password'}
                              value={loginForm.password}
                              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                              className="pl-10 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>

                        </div>
                      </div>
                      <div className="text-center">
                        <Button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white login-btn"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Loading...' : t.signIn}
                        </Button>
                      </div>
                      <div className="text-center">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-green-600 hover:text-green-700 p-0"
                          onClick={() => setAuthMode('forgot')}
                        >
                          {t.forgotPassword}
                        </Button>
                      </div>
                    </div>

                  </CardContent>

                </form>
              </Card>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <Card>
                <form onSubmit={handleRegister} className="register-form">
                  <div>
                    <div className="register-card relative">
                      <div>
                        <Label htmlFor="first-name">{t.firstName}</Label>
                        <Input
                          id="first-name"
                          value={registerForm.firstName}
                          onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="last-name">{t.lastName}</Label>
                        <Input
                          id="last-name"
                          value={registerForm.lastName}
                          onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                          required
                        />
                      </div>


                      <div className="space-y-2">
                        <Label htmlFor="register-email">{t.email}</Label>
                        <div className="relative">
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="example@afiyazone.com"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t.phone}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+971521234567"
                          value={registerForm.phone}
                          onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">{t.password}</Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">{t.confirmPassword}</Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="terms"
                            checked={registerForm.acceptTerms}
                            onChange={(e) => setRegisterForm({ ...registerForm, acceptTerms: e.target.checked })}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            required
                            placeholder={t.termsAccept}
                            title={t.termsAccept}
                          />
                          <Label htmlFor="terms" className="text-sm">
                            {t.termsAccept}
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="newsletter"
                            checked={registerForm.newsletter}
                            onChange={(e) => setRegisterForm({ ...registerForm, newsletter: e.target.checked })}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            title={t.newsletter}
                            placeholder={t.newsletter}
                          />
                          <Label htmlFor="newsletter" className="text-sm">
                            {t.newsletter}
                          </Label>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-green-600 hover:bg-green-700 text-white register-btn"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Loading...' : t.createAccount}
                        </Button>

                      </div>
                    </div>
                  </div>

                </form>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* forget password */}
        {authMode === 'forgot' && (
          <Card>
            <CardHeader>
              <div className="text-center">
                <Lock className="w-6 h-6 text-green-600 mx-auto mb-2" />
              </div>
              <h5 className="text-center text-green-600">{t.resetPassword}</h5>
            </CardHeader>

            <form onSubmit={handleForgotPassword}>
              <div className='forget-form'>
                <CardContent className="space-y-4">
                  <div className="space-y-2 forget-email">
                    <Label htmlFor="forgot-email">{t.email}</Label>
                    <div className="relative">
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="example@afiyazone.com"
                        value={forgotPasswordForm.email}
                        onChange={(e) => setForgotPasswordForm({ ...forgotPasswordForm, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </CardContent>

                <div className='forget-btns'>
                  <CardFooter className="flex flex-col space-y-3">
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-600 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : t.sendResetLink}
                    </Button>

                    <Button
                      type="button"
                      variant="link"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => setAuthMode('login')}
                    >
                      {t.backToLogin}
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </form>
          </Card>
        )}

        {authMode === 'reset' && (
          <Card>
            <CardHeader>
              <div className="text-center">
                <Lock className="w-12 h-12 text-green-600 mx-auto mb-2" />
              </div>
              <h3 className="text-center text-lg font-semibold">{t.setPassword}</h3>
            </CardHeader>
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-password">{t.newPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="reset-password"
                      type={showPassword ? 'text' : 'password'}
                      value={resetPasswordForm.password}
                      onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reset-confirm-password">{t.confirmNewPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={resetPasswordForm.confirmPassword}
                      onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, confirmPassword: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : t.setPassword}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => setAuthMode('login')}
                >
                  {t.backToLogin}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
