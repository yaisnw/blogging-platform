import AuthField from '../molecules/AuthField';
import AppButton from '../atoms/AppButton';
import { useAuthForm } from '../../hooks/useAuthForm';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useLogInUserMutation } from '../../services/authApi';
import { Link, useNavigate } from 'react-router';
import styles from '../../styles/ui.module.css'
import { useGoogleLogin } from '@react-oauth/google';

type LoginFormProps = React.FormHTMLAttributes<HTMLFormElement>;
export type ErrorResponse = { message: string };

const LoginForm: React.FC<LoginFormProps> = ({ ...props }) => {
    const navigate = useNavigate();
    const { formData, errors, handleChange, validate } = useAuthForm([
        'email',
        'password'
    ])
    const [logInUser, { isLoading, error }] = useLogInUserMutation();

    const justRegistered = useSelector((state: RootState) => state.ui.justRegistered)

    const login = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect',
        scope: 'openid email profile',
        redirect_uri: 'http://localhost:5173/oauth',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = validate();

        if (!success) return;

        try {
            const token = await logInUser({ email: formData.email, password: formData.password }).unwrap()

            localStorage.setItem('token', token)
            navigate('../home')
        }
        catch (e) {
            console.log(e)
            console.error(error)
        }
    };
    if (isLoading)
        return (<span className={styles.loader}></span>)
    else {
        return (
            <div>
                <AppButton imageSrc='/google.svg' className={styles.googleContainer} imageContainer={styles.googleFlex} imageClass={styles.googleImage} onClick={() => login()}></AppButton>
                <form onSubmit={handleSubmit} {...props}>
                    {justRegistered && <div>You have signed up!</div>}
                    {error && ('status' in error && <div style={{ color: 'red' }}>{'error' in error ? error.error : (error.data as ErrorResponse).message}</div>)}
                    {errors.email && <div>{errors.email}</div>}
                    <AuthField name="email" label="Enter your email:" autoComplete="email" type="email" value={formData.email} onChange={handleChange} />
                    {errors.password && <div>{errors.password}</div>}
                    <AuthField name="password" label="Enter password:" autoComplete='current-password' type="password" value={formData.password} onChange={handleChange} />
                    <AppButton>Log in</AppButton>
                </form>

                <Link to='/signup'>No account? Sign up here.</Link>
            </div>
        )
    }
}

export default LoginForm
