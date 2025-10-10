import AuthField from '../molecules/AuthField';
import AppButton from '../atoms/AppButton';
import styles from '../../styles/ui.module.css';
import AppLoader from '../atoms/AppLoader';
import ErrorMessage from '../atoms/ErrorState';
import AppLink from '../atoms/AppLink';

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
      <AppButton
        imageSrc='/google.svg'
        className={styles.googleContainer}
        imageContainer={styles.googleFlex}
        imageClass={styles.googleImage}
        onClick={onGoogleLogin}
      />

      <form onSubmit={onSubmit}>
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
      </form>
      <AppLink to={mode === 'login' ? '/login' : '/signup'}>No account? Sign up here.</AppLink>
    </div>
  );
};

export default AuthForm;
