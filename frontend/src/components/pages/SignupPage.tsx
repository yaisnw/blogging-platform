import AuthTemplate from "../templates/AuthTemplate";
import SignupForm from "../organisms/SignupForm";

const SignupPage = () => {
    return (
        <div>
            <AuthTemplate>
                <SignupForm></SignupForm>
            </AuthTemplate>
        </div>
    )
}

export default SignupPage