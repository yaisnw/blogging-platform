import AppLink from '../atoms/AppLink';
import { Outlet, useNavigate } from 'react-router';
import styles from '../../styles/nav.module.css'
import { useJwtAuth } from '@/hooks/useJwtAuth';
import { useAppDispatch } from '@/hooks';
import { logOut } from '@/slices/authSlice';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { persistor } from '@/store';

export function isTokenExpired(token: string | null) {
    if (!token) return true;

    try {
        const { exp } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return exp! < currentTime;
    } catch (error) {
        console.error(error)
        return true;
    }
}

const NavBar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loggedIn } = useJwtAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (isTokenExpired(token)) {
            localStorage.removeItem('token');
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
                                <AppLink to="/profile">Profile</AppLink>
                                <AppLink to="/support">Support</AppLink>
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
                                <AppLink to="/support">Support</AppLink>
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

    // else if (loggedIn) {
    //     return (
    //         <div>
    //             <nav className={styles.nav}>
    //                 <div className={styles.nav1}>
    //                     <AppLink to='./home' >Home</AppLink>
    //                     <AppLink to=''>Blogs</AppLink>
    //                     <AppLink to='/myBlogs'>My Blogs</AppLink>
    //                 </div>
    //                 <div className={styles.nav1}>
    //                     <AppLink to='../profile'>Profile</AppLink>
    //                     <AppLink to='../support' >Support</AppLink>
    //                     <a href='#' onClick={logOutHandler} >Log out</a>
    //                 </div>
    //             </nav>
    //             <Outlet />
    //         </div>
    //     )
    // }
}

export default NavBar