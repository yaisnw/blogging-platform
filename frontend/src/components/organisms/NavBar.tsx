import AppLink from '../atoms/AppLink';
import { Outlet, useNavigate } from 'react-router';
import styles from '../../styles/nav.module.css'
import { useEffect } from 'react';
import { persistor } from '@/store';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useAppDispatch } from '@/hooks';
import { logOut } from '@/slices/authSlice';


const NavBar = () => {
    const dispatch = useAppDispatch();
    const { loggedIn, authChecked } = useAuthStatus();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loggedIn && authChecked) {
            dispatch(logOut())
            navigate('/login')
        }
    }, [dispatch, navigate, loggedIn, authChecked])

    const logOutHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('token')
        persistor.purge();
        navigate('/login')
    }


    return (
        <>

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

            <Outlet />
        </>
    )

}

export default NavBar