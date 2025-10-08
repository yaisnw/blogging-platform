import AuthForm from "../organisms/AuthForm";
import { useAuthForm } from "../../hooks/useAuthForm";
import { useLogInUserMutation } from "../../services/authApi";
import { useNavigate, Link } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import AuthTemplate from "../templates/AuthTemplate";
import { useAppDispatch } from "@/hooks";
import { setTokenData } from "@/slices/authSlice";
import SEO from "../atoms/SEO";

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
        redirect_uri: "http://localhost:5173/oauth",
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
            {justRegistered && <div>You have signed up!</div>}
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
            />
            <Link to="/signup">No account? Sign up here.</Link>
        </AuthTemplate>
    );
};

export default LoginPage;
