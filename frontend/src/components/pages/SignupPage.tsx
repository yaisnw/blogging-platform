import AuthTemplate from "../templates/AuthTemplate";
import AuthForm from "../organisms/AuthForm";
import { useAuthForm } from "../../hooks/useAuthForm";
import { useSignUpUserMutation } from "../../services/authApi";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setJustRegistered } from "@/slices/authSlice";
import { useGoogleLogin } from "@react-oauth/google";
import type { AppDispatch } from "../../store";
import type { ErrorResponse } from "./LoginPage";
import SEO from "../atoms/SEO";

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
            <SEO title="Signup" description="Create an account today to start making your personal blog posts." />
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
        </AuthTemplate>
    );
};

export default SignupPage;
