import AppLink from '../atoms/AppLink';
import { Outlet, useNavigate } from 'react-router';
import styles from '../../styles/nav.module.css'
import { useAppDispatch } from '@/hooks';
import { logOut } from '@/slices/authSlice';
import { useEffect, useState } from 'react';
import { persistor } from '@/store';
import { isTokenExpired } from '@/hooks/useAuthStatus';


const NavBar = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            setLoggedIn(true)
        }
        else if (isTokenExpired(token)) {
            localStorage.removeItem('token');
            setLoggedIn(false)
            dispatch(logOut())
            navigate('/login')
        }
    }, [dispatch, navigate])

    const logOutHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('token')
        dispatch(logOut())
        persistor.purge();
        navigate('/login')
    }


    return (
        <>
            <header>
                <nav className={styles.nav}>
                    {loggedIn ? (
                        <>
                            <div className={styles.nav1}>
                                <AppLink to="/home">Home</AppLink>
                                <AppLink to="/home/posts">Posts</AppLink>
                                <AppLink to="myPosts">My Posts</AppLink>
                            </div>
                            <div className={styles.nav1}>
                                <AppLink to="/home/profile">Profile</AppLink>
                                <AppLink to="/home/support">Support</AppLink>
                                <a href="#" onClick={logOutHandler}>Log out</a>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.nav1}>
                                <AppLink to="/home">Home</AppLink>
                                <AppLink to="/home/posts">Posts</AppLink>
                            </div>
                            <div className={styles.nav1}>
                                <AppLink to="/home/support">Support</AppLink>
                                <AppLink to="/login">Log in</AppLink>
                                <AppLink to="/signup">Get Started</AppLink>
                            </div>
                        </>
                    )}
                </nav>
            </header>
            <Outlet />
        </>
    )

}

export default NavBar