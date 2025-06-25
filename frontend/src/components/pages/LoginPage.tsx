import AuthTemplate from "../templates/AuthTemplate";
import LoginForm from "../organisms/LoginForm";

const LoginPage = () => {
    return (
        <div>
            <AuthTemplate>
                <LoginForm/>
            </AuthTemplate>
        </div>
    )
}

export default LoginPage