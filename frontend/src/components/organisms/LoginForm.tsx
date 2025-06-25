import AuthField from '../molecules/AuthField';
import AppButton from '../atoms/AppButton';
import { useAuthForm } from '../../hooks/useAuthForm';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useLogInUserMutation } from '../../services/authApi';
import { useNavigate } from 'react-router';
import styles from '../../styles/loader.module.css'

type LoginFormProps = React.FormHTMLAttributes<HTMLFormElement>;
type ErrorResponse = { message: string };

const LoginForm: React.FC<LoginFormProps> = ({ ...props }) => {
    const navigate = useNavigate();
    const { formData, errors, handleChange, validate } = useAuthForm([
        'email',
        'password'
    ])
    const [logInUser, { isLoading, error }] = useLogInUserMutation();

    const justRegistered = useSelector((state: RootState) => state.authUi.justRegistered)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = validate();

        if (!success) return;

        try {
            await logInUser({ email: formData.email, password: formData.password }).unwrap()

            navigate('home')
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
            <form onSubmit={handleSubmit} {...props}>
                {justRegistered && <div>You have signed up!</div>}
                {error && ('status' in error && <div style={{ color: 'red' }}>{'error' in error ? error.error : (error.data as ErrorResponse).message}</div>)}
                {errors.email && <div>{errors.email}</div>}
                <AuthField name="email" label="Enter your email:" type="email" value={formData.email} onChange={handleChange} />
                {errors.password && <div>{errors.password}</div>}
                <AuthField name="password" label="Enter password:" type="password" value={formData.password} onChange={handleChange} />
                <AppButton>Log in</AppButton>
            </form>
        )
    }
}

export default LoginForm
