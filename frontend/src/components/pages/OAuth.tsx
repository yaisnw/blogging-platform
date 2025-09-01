import { useEffect, useState } from 'react';
import styles from '../../styles/ui.module.css'
import { useOAuthLoginMutation } from '../../services/authApi';
import { useNavigate } from 'react-router';
import type { ErrorResponse } from '../organisms/LoginForm';

const OAuth = () => {
    const navigate = useNavigate();
    const [oAuthLogin, { error }] = useOAuthLoginMutation();
    const [serverError, setServerError] = useState<string | null>(null);
    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        if (!code) {
            setServerError('Missing authorization code.');
            navigate('../login');
            return;
        }
        const fetchToken = async () => {
            try {
                const token = await oAuthLogin({ code }).unwrap();
                localStorage.setItem('token', token);
                navigate('../home');
            } catch (err) {
                if (error) {
                    if ('error' in error) {
                        setServerError(error.error)
                    }
                    else if ('status' in error) {
                        setServerError((error.data as ErrorResponse).message)
                    }
                }
                console.error(err)
                setTimeout(() => navigate('../login'), 5000)
            }
        };
        fetchToken();
    }, [navigate, oAuthLogin, error]);



    return (
        <div>
            {serverError ? (
                <div >{serverError}</div>
            ) : (
                <div className={styles.loaderCenter}>
                    <div>Signing in with Google...</div>
                    <span className={styles.loader}></span>
                </div>
            )}
        </div>
    )
}

export default OAuth