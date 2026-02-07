// components/molecules/LoginForm/LoginForm.tsx
'use client';

import type { FC, FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Input, Button, Checkbox, Title } from '@/components/atoms';
import { FormField } from '@/components/molecules';
import {
  getLoginFormClasses,
  type LoginFormVariant,
} from './LoginForm.style';

export type LoginMode = 'email' | 'username';

export interface LoginFormProps {
  /** Variante visiva del form */
  variant?: LoginFormVariant;
  /** Modalità login: email (con validazione) o username (senza validazione email) */
  mode?: LoginMode;
  /** Titolo del form */
  title?: ReactNode;
  /** Sottotitolo del form */
  subtitle?: ReactNode;
  /** Label per il campo username/email */
  usernameLabel?: string;
  /** Placeholder per il campo username/email */
  usernamePlaceholder?: string;
  /** Testo del bottone submit */
  submitLabel?: string;
  /** Mostra link "Password dimenticata" */
  showForgotPassword?: boolean;
  /** Testo link password dimenticata */
  forgotPasswordLabel?: string;
  /** URL link password dimenticata */
  forgotPasswordHref?: string;
  /** Mostra checkbox "Ricordami" */
  showRememberMe?: boolean;
  /** Testo checkbox ricordami */
  rememberMeLabel?: string;
  /** Mostra link registrazione */
  showRegisterLink?: boolean;
  /** Testo prima del link registrazione */
  registerText?: string;
  /** Testo del link registrazione */
  registerLinkLabel?: string;
  /** URL link registrazione */
  registerHref?: string;
  /** Stato di loading */
  loading?: boolean;
  /** Messaggio di errore generale */
  error?: string;
  /** Callback al submit del form */
  onSubmit?: (data: { email: string; password: string; rememberMe: boolean }) => void;
  /** Action URL per form tradizionale */
  formAction?: string;
  /** Metodo HTTP */
  formMethod?: 'get' | 'post';
  /** Classe CSS aggiuntiva */
  className?: string;
}

export const LoginForm: FC<LoginFormProps> = ({
  variant = 'default',
  mode = 'email',
  title = 'Accedi',
  subtitle,
  usernameLabel,
  usernamePlaceholder,
  submitLabel = 'Accedi',
  showForgotPassword = true,
  forgotPasswordLabel = 'Password dimenticata?',
  forgotPasswordHref = '/forgot-password',
  showRememberMe = true,
  rememberMeLabel = 'Ricordami',
  showRegisterLink = true,
  registerText = 'Non hai un account?',
  registerLinkLabel = 'Registrati',
  registerHref = '/register',
  loading = false,
  error,
  onSubmit,
  formAction,
  formMethod = 'post',
  className = '',
}) => {
  const classes = getLoginFormClasses({ variant });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const isEmailMode = mode === 'email';
  const fieldLabel = usernameLabel || (isEmailMode ? 'Email' : 'Username');
  const fieldPlaceholder = usernamePlaceholder || (isEmailMode ? 'nome@esempio.com' : 'Il tuo username');

  const validateUsername = (value: string): boolean => {
    if (!value) {
      setUsernameError(isEmailMode ? 'L\'email è obbligatoria' : 'L\'username è obbligatorio');
      return false;
    }
    if (isEmailMode) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setUsernameError('Inserisci un\'email valida');
        return false;
      }
    }
    setUsernameError(undefined);
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('La password è obbligatoria');
      return false;
    }
    setPasswordError(undefined);
    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      e.preventDefault();

      const isUsernameValid = validateUsername(username);
      const isPasswordValid = validatePassword(password);

      if (isUsernameValid && isPasswordValid) {
        onSubmit({ email: username, password, rememberMe });
      }
    }
  };

  const inputVariant = variant === 'glass' ? 'glass' : 'default';

  return (
    <div className={[classes.root, className].filter(Boolean).join(' ')}>
      <div className={classes.card}>
        {/* Header */}
        <div className={classes.header}>
          {title && <Title as='h1' tone="white" className={classes.title}>{title}</Title>}
          {subtitle && <Title as='h2' variant='subtitle' tone="white" className={classes.subtitle}>{subtitle}</Title>}
        </div>

        {/* Error generale */}
        {error && (
          <div className="mb-md p-sm bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          className={classes.form}
          onSubmit={handleSubmit}
          action={formAction}
          method={formAction ? formMethod : undefined}
          noValidate
        >
          <div className={classes.fieldGroup}>
            {/* Username/Email */}
            <FormField
              id="login-username"
              label={fieldLabel}
              required
              invalid={!!usernameError}
              errorText={usernameError}
            >
              <Input
                type={isEmailMode ? 'email' : 'text'}
                name="email"
                placeholder={fieldPlaceholder}
                variant={inputVariant}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (usernameError) validateUsername(e.target.value);
                }}
                onBlur={() => validateUsername(username)}
                leftIcon={isEmailMode ? <Mail size={18} /> : <User size={18} />}
                autoComplete={isEmailMode ? 'email' : 'username'}
                disabled={loading}
              />
            </FormField>

            {/* Password */}
            <FormField
              id="login-password"
              label="Password"
              required
              invalid={!!passwordError}
              errorText={passwordError}
            >
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="La tua password"
                variant={inputVariant}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(password)}
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-white transition-colors"
                    aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                autoComplete="current-password"
                disabled={loading}
              />
            </FormField>
          </div>

          {/* Footer con Remember me e Forgot password */}
          {(showRememberMe || showForgotPassword) && (
            <div className={classes.footer}>
              {showRememberMe && (
                <Checkbox
                  id="login-remember"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  label={rememberMeLabel}
                />
              )}
              {showForgotPassword && (
                <a href={forgotPasswordHref} className={classes.forgotPassword}>
                  {forgotPasswordLabel}
                </a>
              )}
            </div>
          )}

          {/* Submit */}
          <div className={classes.actions}>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              {submitLabel}
            </Button>
          </div>
        </form>

        {/* Register link */}
        {showRegisterLink && (
          <p className={classes.registerLink}>
            {registerText}
            <a href={registerHref} className={classes.registerLinkAnchor}>
              {registerLinkLabel}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};
