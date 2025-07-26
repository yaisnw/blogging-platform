import { useEffect, useRef, useState } from 'react';
import AppLink from '../atoms/AppLink';
import { Outlet, useNavigate } from 'react-router';
import styles from '../../styles/nav.module.css'
import { jwtDecode } from 'jwt-decode';
import { setTokenData } from '../../slices/authSlice';
import { useAppDispatch } from '../../hooks';

interface MyToken {
    id: number;
    username: string;
    email: string;
    exp?: number;
    iat?: number;
}


const NavBar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loggedIn, setLoggedIn] = useState(false)
    const token = useRef<string | null>(null);

    useEffect(() => {
        token.current = localStorage.getItem("token");
        if (token.current) {
            setLoggedIn(true);
            const decoded = jwtDecode<MyToken>(token.current);
            dispatch(setTokenData({
                id: decoded.id,
                username: decoded.username,
                email: decoded.email
            }));
        } else {
            setLoggedIn(false);
        }
    }, [dispatch])

    const logOutHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('token')
        setLoggedIn(false)
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
                                <AppLink to="/blogs">Blogs</AppLink>
                                <AppLink to="myBlogs">My Blogs</AppLink>
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
                                <AppLink to="/blogs">Blogs</AppLink>
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