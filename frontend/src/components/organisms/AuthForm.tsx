import AuthField from '../molecules/AuthField';
import AppButton from '../atoms/AppButton';
import styles from "@/styles/auth.module.css"
import UIstyles from "@/styles/ui.module.css"
import AppLoader from '../atoms/AppLoader';
import ErrorState from '../atoms/ErrorState';
import AppLink from '../atoms/AppLink';
import AppHeadingTwo from '../atoms/AppHeadingTwo';
import { GoogleSVG } from '../atoms/Icons';

type AuthFormProps = {
  mode: "login" | "signup";
  formData: Record<string, string>;
  errors: Record<string, string>;
  isLoading: boolean;
  errorMsg?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
};

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  formData,
  errors,
  isLoading,
  errorMsg,
  onChange,
  onSubmit,
  onGoogleLogin
}) => {
  return (
    <div className={styles.authFormWrapper}>
      {isLoading &&
        <AppLoader mode='page' />}

      <div className={styles.authFormContainer}>



        <div className={styles.oAuthContainer}>
          <AppHeadingTwo>{mode === 'login' ? 'Login with:' : 'Sign up with:'}</AppHeadingTwo>
          <AppButton
            type='button'
            className={styles.googleContainer}
            onClick={onGoogleLogin}
          ><GoogleSVG className={styles.googleSVG} /></AppButton>
        </div>


        <div className={UIstyles.divider}><span>or</span></div>
        <form onSubmit={onSubmit} className={styles.authForm}>
          <AppHeadingTwo >{mode === 'login' ? 'Enter your credentials to log in:' : 'Create your account:'}</AppHeadingTwo>
          {errorMsg && <ErrorState mode="mini" message={errorMsg} />}
          {mode === "signup" && (
            <>
              {errors.username && <ErrorState mode="mini" message={errors.username} />}
              <AuthField
                name="username"
                autoComplete="username"
                placeholder='Username'
                value={formData.username || ""}
                onChange={onChange}

              />
            </>
          )}

          {errors.email && <ErrorState mode="mini" message={errors.email} />}
          <AuthField
            name="email"
            placeholder='Email'
            type="email"
            autoComplete="email"
            value={formData.email || ""}
            onChange={onChange}
          />

          {errors.password && <ErrorState mode="mini" message={errors.password} />}
          <AuthField
            name="password"
            placeholder='Password'
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={formData.password || ""}
            onChange={onChange}
          />

          {mode === "signup" && (
            <>
              {errors.confirmPassword && <ErrorState mode="mini" message={errors.confirmPassword} />}
              {errors.confirmPasswordMatch && (
                <ErrorState message={errors.confirmPasswordMatch} />
              )}
              <AuthField
                name="confirmPassword"
                placeholder='Confirm Password'
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword || ""}
                onChange={onChange}
              />
            </>
          )}
          <AppButton disabled={isLoading}>
            {mode === "login" ? "Log in" : "Sign up"}
          </AppButton>
        </form>
      </div>
      <AppLink to={mode === 'login' ? '/signup' : '/login'}>{mode === 'login' ? "No account? Sign up here." : 'Have an account already? Log in here.'}</AppLink>
      <AppLink to='/home'>Continue as a guest.</AppLink>
    </div>
  );
};

export default AuthForm;
