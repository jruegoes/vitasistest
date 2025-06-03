import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { login } from '../../api/auth';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLoginSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setLoginError(t('auth.emailAndPasswordRequired'));
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);
    setLoginSuccess(false);

    try {
      // Login with email and password - this handles token storage automatically
      await login(email.trim(), password.trim());
      
      setLoginSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 1000); // Brief success state before transitioning
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          setLoginError(t('auth.invalidCredentials'));
        } else {
          setLoginError(t('auth.loginFailed'));
        }
      } else {
        setLoginError(t('auth.loginFailed'));
      }
    } finally {
      setIsLoggingIn(false);
    }
  }, [email, password, t, onLoginSuccess]);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear errors when user starts typing
    if (loginError) {
      setLoginError(null);
    }
    if (loginSuccess) {
      setLoginSuccess(false);
    }
  }, [loginError, loginSuccess]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear errors when user starts typing
    if (loginError) {
      setLoginError(null);
    }
    if (loginSuccess) {
      setLoginSuccess(false);
    }
  }, [loginError, loginSuccess]);

  return (
    <div className="flex flex-col items-center space-y-6 p-8 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          </div>
        </div>
        <h2 className="text-2xl font-bold font-montserrat text-gray-900 dark:text-gray-100">
          {t('auth.loginRequired')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-dm-sans">
          {t('auth.enterCredentialsDescription')}
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <label 
            htmlFor="email" 
            className="block text-sm font-semibold font-inter text-gray-700 dark:text-gray-300"
          >
            {t('auth.email')}
          </label>
          
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={t('auth.enterEmail')}
              className={`
                w-full px-4 py-3 pr-12 rounded-xl border font-dm-sans text-sm
                bg-white dark:bg-gray-800 
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                disabled:opacity-50 disabled:cursor-not-allowed
                ${loginError 
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 text-red-900 dark:text-red-100' 
                  : loginSuccess
                  ? 'border-green-300 dark:border-green-700 focus:ring-green-500 text-green-900 dark:text-green-100'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 text-gray-900 dark:text-gray-100'
                }
              `}
              disabled={isLoggingIn || loginSuccess}
              aria-describedby={loginError ? "login-error" : loginSuccess ? "login-success" : undefined}
              autoComplete="email"
            />
            
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <User className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label 
            htmlFor="password" 
            className="block text-sm font-semibold font-inter text-gray-700 dark:text-gray-300"
          >
            {t('auth.password')}
          </label>
          
          <div className="relative">
            <input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder={t('auth.enterPassword')}
              className={`
                w-full px-4 py-3 pr-12 rounded-xl border font-dm-sans text-sm
                bg-white dark:bg-gray-800 
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                disabled:opacity-50 disabled:cursor-not-allowed
                ${loginError 
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 text-red-900 dark:text-red-100' 
                  : loginSuccess
                  ? 'border-green-300 dark:border-green-700 focus:ring-green-500 text-green-900 dark:text-green-100'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 text-gray-900 dark:text-gray-100'
                }
              `}
              disabled={isLoggingIn || loginSuccess}
              aria-describedby={loginError ? "login-error" : loginSuccess ? "login-success" : undefined}
              autoComplete="current-password"
            />
            
            {/* Toggle Password Visibility Button */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isPasswordVisible ? t('auth.hidePassword') : t('auth.showPassword')}
              disabled={isLoggingIn || loginSuccess}
            >
              {isPasswordVisible ? (
                <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Validation Messages */}
        {loginError && (
          <div 
            id="login-error"
            className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-red-700 dark:text-red-300 font-dm-sans">
              {loginError}
            </span>
          </div>
        )}

        {loginSuccess && (
          <div 
            id="login-success"
            className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            role="status"
          >
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-green-700 dark:text-green-300 font-dm-sans">
              {t('auth.loginSuccessful')}
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoggingIn || loginSuccess || !email.trim() || !password.trim()}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold font-inter
            transition-all duration-200 transform hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            ${loginSuccess
              ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white'
              : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white'
            }
          `}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t('auth.loggingIn')}
            </>
          ) : loginSuccess ? (
            <>
              <CheckCircle className="h-4 w-4" aria-hidden="true" />
              {t('auth.loginSuccessful')}
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" aria-hidden="true" />
              {t('auth.login')}
            </>
          )}
        </button>
      </form>

      {/* Helper Text */}
      <div className="text-center space-y-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-dm-sans">
          {t('auth.credentialsSecurityNote')}
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 