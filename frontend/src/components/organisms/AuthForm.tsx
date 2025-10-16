import AuthField from '../molecules/AuthField';
import AppButton from '../atoms/AppButton';
import styles from "@/styles/auth.module.css"
import UIstyles from "@/styles/ui.module.css"
import AppLoader from '../atoms/AppLoader';
import ErrorMessage from '../atoms/ErrorState';
import AppLink from '../atoms/AppLink';
import AppImage from '../atoms/AppImage';
import AppHeader from '../atoms/AppHeading';
import AppParagraph from '../atoms/AppParagraph';

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
    <div>
      {isLoading &&
        <AppLoader mode='page' />}


      <form onSubmit={onSubmit} className={styles.authForm}>
        <AppHeader>{mode === 'login' ? 'Enter your credentials to log in:' : 'Create your account:'}</AppHeader>
        {mode === "signup" && (
          <>
            {errors.username && <ErrorMessage message={errors.username} />}
            <AuthField
              name="username"
              label="Enter your username:"
              autoComplete="username"
              value={formData.username || ""}
              onChange={onChange}

            />
          </>
        )}

        {errorMsg && <ErrorMessage message={errorMsg} />}
        {errors.email && <div>{errors.email}</div>}
        <AuthField
          name="email"
          label="Enter your email:"
          type="email"
          autoComplete="email"
          value={formData.email || ""}
          onChange={onChange}
        />

        {errors.password && <ErrorMessage message={errors.password} />}
        <AuthField
          name="password"
          label="Enter your password:"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={formData.password || ""}
          onChange={onChange}
        />

        {mode === "signup" && (
          <>
            {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}
            {errors.confirmPasswordMatch && (
              <ErrorMessage message={errors.confirmPasswordMatch} />
            )}
            <AuthField
              name="confirmPassword"
              label="Confirm password:"
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
        <div className={UIstyles.divider}><span>or</span></div>
        <div className={styles.oAuthContainer}>
          <AppParagraph>{mode === 'login' ? 'Login with:' : 'Sign up with:'}</AppParagraph>
          <AppButton
            type='button'
            className={styles.googleContainer}
            onClick={onGoogleLogin}
          ><AppImage className={styles.googleImage} src='./google.svg' /></AppButton>
        </div>
        <AppLink to={mode === 'login' ? '/signup' : '/login'}>{mode === 'login' ? "No account? Sign up here." : 'Have an account already? Log in here.'}</AppLink>
      </form>
    </div>
  );
};

export default AuthForm;
