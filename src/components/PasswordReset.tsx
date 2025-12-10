import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '../services/api';

const translations = {
  en: {
    setPassword: 'Set New Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    passwordRequired: 'Password is required',
    passwordMismatch: 'Passwords do not match',
    passwordResetSuccess: 'Password reset successfully!',
    invalidResetToken: 'Invalid or expired reset token',
    backToLogin: 'Back to Login',
  },
  ar: {
    setPassword: 'تعيين كلمة المرور الجديدة',
    newPassword: 'كلمة المرور الجديدة',
    confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
    updatePassword: 'تحديث كلمة المرور',
    passwordRequired: 'كلمة المرور مطلوبة',
    passwordMismatch: 'كلمة المرور غير متطابقة',
    passwordResetSuccess: 'تمت إعادة تعيين كلمة المرور بنجاح!',
    invalidResetToken: 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية',
    backToLogin: 'العودة إلى تسجيل الدخول',
  },
};

export function PasswordReset() {
  // Get token from URL (in a real app, you would use react-router-dom)
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || '';
  };

  const token = getTokenFromUrl();
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const t = translations[language];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [resetPasswordForm, setResetPasswordForm] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Detect language from browser or localStorage
    const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    setLanguage(browserLang);
  }, []);

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

    if (!token) {
      toast.error(t.invalidResetToken);
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.resetPassword(token, resetPasswordForm.password);
      toast.success(t.passwordResetSuccess);
      // Redirect to login page (in a real app, you would use navigate)
      window.location.href = '/login';
    } catch (error: any) {
      toast.error(error.message || t.invalidResetToken);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <Lock className="w-12 h-12 text-green-600 mx-auto mb-2" />
          </div>
          <h1 className="text-center text-2xl font-bold text-green-800">{t.setPassword}</h1>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-password">{t.newPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
              {isLoading ? 'Loading...' : t.updatePassword}
            </Button>
            <Button
              type="button"
              variant="link"
              className="text-green-600 hover:text-green-700"
              onClick={() => window.location.href = '/login'}
            >
              {t.backToLogin}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}