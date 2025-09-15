import AuthField from '../molecules/AuthField';
import AppButton from '../atoms/AppButton';
import styles from '../../styles/ui.module.css';

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
      <div className={styles.loaderCenter}>
        <span className={styles.loader}></span>
      </div>}
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
            {errors.username && <div>{errors.username}</div>}
            <AuthField
              name="username"
              label="Enter your username:"
              autoComplete="username"
              value={formData.username || ""}
              onChange={onChange}
            />
          </>
        )}

        {errorMsg && <div style={{ color: "red" }}>{errorMsg}</div>}
        {errors.email && <div>{errors.email}</div>}
        <AuthField
          name="email"
          label="Enter your email:"
          type="email"
          autoComplete="email"
          value={formData.email || ""}
          onChange={onChange}
        />

        {errors.password && <div>{errors.password}</div>}
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
            {errors.confirmPassword && <div>{errors.confirmPassword}</div>}
            {errors.confirmPasswordMatch && (
              <div>{errors.confirmPasswordMatch}</div>
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
    </div>
  );
};

export default AuthForm;
