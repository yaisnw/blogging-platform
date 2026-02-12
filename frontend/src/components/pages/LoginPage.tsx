import AuthForm from "../organisms/AuthForm";
import { useAuthForm } from "../../hooks/useAuthForm";
import { useLogInUserMutation } from "../../services/authApi";
import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import AuthTemplate from "../templates/AuthTemplate";
import { useAppDispatch } from "@/hooks";
import { setTokenData } from "@/slices/authSlice";
import SEO from "../atoms/SEO";
import SuccessState from "../atoms/SuccessState";
import LoginSampleComponent from "../molecules/LoginSampleComponent";
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

export type ErrorResponse = { message: string };

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { formData, errors, handleChange, validate } = useAuthForm([
        "email",
        "password",
    ]);
    const [logInUser, { isLoading, error }] = useLogInUserMutation();

    const justRegistered = useSelector(
        (state: RootState) => state.auth.justRegistered
    );
    
    const login = useGoogleLogin({
        flow: "auth-code",
        ux_mode: "redirect",
        scope: "openid email profile",
        redirect_uri: `${REDIRECT_URL}`,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const response = await logInUser({
            email: formData.email,
            password: formData.password,
        }).unwrap();
        localStorage.setItem("token", response.token);
        dispatch(setTokenData({
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
            avatar_url: response.user.avatar_url
        }));

        navigate("../home");

    };
    
    return (
        <AuthTemplate>
            <SEO title="Login" description="Log in to your account to manage your own posts" />
            <LoginSampleComponent />
            {justRegistered && <SuccessState mode="login" message="You have successfully signed up!" />}
            <AuthForm
                mode="login"
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
                onGoogleLogin={() => login()}
                hasSample={true}
            />
        </AuthTemplate>
    );
};

export default LoginPage;
