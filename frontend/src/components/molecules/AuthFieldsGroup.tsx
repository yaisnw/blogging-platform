import AuthField from "./AuthField";
import ErrorMessage from "../atoms/ErrorMessage";

type Props = {
  errors: Record<string, string>;
  formData: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AuthFieldsGroup: React.FC<Props> = ({ errors, formData, handleChange }) => {
  return (
    <>
      {errors.email && <ErrorMessage message={errors.email} />}
      <AuthField
        name="email"
        label="Enter your email:"
        autoComplete="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />

      {errors.password && <ErrorMessage message={errors.password} />}
      <AuthField
        name="password"
        label="Enter password:"
        autoComplete="current-password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
    </>
  );
};

export default AuthFieldsGroup;
