import AuthField from '../molecules/AuthField';
import AppButton from '../atoms/AppButton';
import { useAuthForm } from '../../hooks/useAuthForm';
import { useSignUpUserMutation } from '../../services/authApi';
import { Link, useNavigate } from 'react-router';
import styles from '../../styles/ui.module.css'
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { setJustRegistered } from '../../slices/authUiSlice';


type SignupFormProps = React.FormHTMLAttributes<HTMLFormElement>;
type ErrorResponse = { message: string };

const SignupForm: React.FC<SignupFormProps> = ({ ...props }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { formData, errors, handleChange, validate } = useAuthForm([
        'username',
        'email',
        'password',
        'confirmPassword'
    ])
    const [signUpUser, { isLoading, error }] = useSignUpUserMutation();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setJustRegistered(false))

        const success = validate(() => {
            const extra: Record<string, string> = {};
            if (formData.password !== formData.confirmPassword) {
                extra.confirmPasswordMatch = 'Passwords do not match';
            }
            return extra;
        })

        if (!success) return;
        try {
            await signUpUser({ username: formData.username, email: formData.email, password: formData.password }).unwrap()
            dispatch(setJustRegistered(true))
            navigate('/login')
        }
        catch (e) {
            console.log(e)
            console.log(error)
        }
    };

    if (isLoading)
        return (<span className={styles.loader}></span>)
    else {
        return (
            <form onSubmit={handleSubmit} {...props}>
                {error && ('status' in error && <div style={{ color: 'red' }}>{'error' in error ? error.error : (error.data as ErrorResponse).message}</div>)}
                {errors.username && <div>{errors.username}</div>}
                <AuthField name="username" label="Enter your username:" autoComplete="username" value={formData.username} onChange={handleChange} />
                {errors.email && <div>{errors.email}</div>}
                <AuthField name="email" label="Enter email:" autoComplete="email" type="email" value={formData.email} onChange={handleChange} />
                {errors.password && <div>{errors.password}</div>}
                <AuthField name="password" label="Enter password:"  type='password' value={formData.password} onChange={handleChange} />
                {errors.confirmPassword ? <div>{errors.confirmPassword}</div> : (errors.confirmPasswordMatch && <div>{errors.confirmPasswordMatch}</div>)}
                <AuthField name="confirmPassword" label="Confirm password:" autoComplete="new-password" type='password' value={formData.confirmPassword} onChange={handleChange} />
                <AppButton disabled={isLoading}>Sign up</AppButton>
                <Link to='/login'>Have an account already? Log in here.</Link>
            </form>
        )
    }
}

export default SignupForm; 