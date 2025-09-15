import AuthTemplate from "../templates/AuthTemplate";
import AuthForm from "../organisms/AuthForm";
import { useAuthForm } from "../../hooks/useAuthForm";
import { useSignUpUserMutation } from "../../services/authApi";
import { useNavigate, Link } from "react-router";
import { useDispatch } from "react-redux";
import { setJustRegistered } from "@/slices/uiSlice";
import { useGoogleLogin } from "@react-oauth/google";
import type { AppDispatch } from "../../store";
import type { ErrorResponse } from "./LoginPage";

const SignupPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { formData, errors, handleChange, validate } = useAuthForm([
        "username",
        "email",
        "password",
        "confirmPassword",
    ]);
    const [signUpUser, { isLoading, error }] = useSignUpUserMutation();

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        ux_mode: "redirect",
        scope: "openid email profile",
        redirect_uri: "http://localhost:5173/oauth",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setJustRegistered(false));

        const success = validate(() => {
            const extra: Record<string, string> = {};
            if (formData.password !== formData.confirmPassword) {
                extra.confirmPasswordMatch = "Passwords do not match";
            }
            return extra;
        });

        if (!success) return;

        try {
            await signUpUser({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            }).unwrap();
            dispatch(setJustRegistered(true));
            navigate("/login");
        } catch {
            //
        }
    };

    return (
        <AuthTemplate>
            <AuthForm
                mode="signup"
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                errorMsg={
                    error && "status" in error
                        ? ("error" in error ? error.error : (error.data as ErrorResponse).message)
                        : ''
                }
                onChange={handleChange}
                onSubmit={handleSubmit}
                onGoogleLogin={() => googleLogin()}
            />
            <Link to="/login">Already have an account? Log in here.</Link>
        </AuthTemplate>
    );
};

export default SignupPage;
