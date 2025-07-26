import AppLink from '../atoms/AppLink';
import { Outlet, useNavigate } from 'react-router';
import styles from '../../styles/nav.module.css'
import { useJwtAuth } from '@/hooks/useJwtAuth';
import { useAppDispatch } from '@/hooks';
import { logOut } from '@/slices/authSlice';

const NavBar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {loggedIn} = useJwtAuth();
    
    const logOutHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('token')
        dispatch(logOut())
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