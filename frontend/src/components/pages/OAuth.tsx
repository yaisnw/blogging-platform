import { useEffect, useState } from 'react';
import { useOAuthLoginMutation } from '../../services/authApi';
import { useNavigate } from 'react-router';
import type { ErrorResponse } from '../pages/LoginPage';
import { useAppDispatch } from '@/hooks';
import { setTokenData } from '@/slices/authSlice';
import AppLoader from '../atoms/AppLoader';
import ErrorState from '../atoms/ErrorState';

const OAuth = () => {
    const dispatch = useAppDispatch();
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
                const response = await oAuthLogin({ code }).unwrap();
                localStorage.setItem('token', response.token);
                dispatch(setTokenData({
                    id: response.user.id,
                    username: response.user.username,
                    email: response.user.email,
                    avatar_url: response.user.avatar_url
                }))
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
    }, [navigate, oAuthLogin, error, dispatch]);



    return (
        <div>
            {serverError ? (
                <ErrorState message={serverError} />
            ) : (
                <AppLoader mode='page' />
            )}
        </div>
    )
}

export default OAuth