import AppLink from '../atoms/AppLink';
import { Outlet, useNavigate } from 'react-router';
import styles from '../../styles/nav.module.css'
import { useEffect } from 'react';
import { persistor } from '@/store';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useAppDispatch } from '@/hooks';
import { logOut } from '@/slices/authSlice';
import SearchBar from '../molecules/SearchBar';
import Footer from './Footer';
import { motion } from "motion/react"

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
            <motion.nav
                className={styles.nav}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}>
                <div className={styles.nav1}>
                    <AppLink className={styles.navButton} to="/home">Home</AppLink>
                    <AppLink className={styles.navButton} to="/home/posts">Posts</AppLink>
                    {loggedIn && <AppLink className={styles.navButton} to="dashboard">Dashboard</AppLink>}
                </div>
                <SearchBar />
                <div className={styles.nav1}>
                    {loggedIn && <AppLink className={styles.navButton} to="/home/profile">Profile</AppLink>}
                    <AppLink className={styles.navButton} to="/home/about">About</AppLink>
                    <AppLink  to="/login" className={styles.navButton} onClick={logOutHandler}>Log out</AppLink>
                </div>
            </motion.nav>
            <Outlet />
            <Footer />
        </>
    )

}

export default NavBar