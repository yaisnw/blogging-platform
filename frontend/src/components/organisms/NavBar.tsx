import AppLink from '../atoms/AppLink';
import { Outlet, useNavigate, useLocation } from 'react-router';
import styles from '../../styles/nav.module.css'
import { useState, useEffect } from 'react';
import { persistor, type RootState } from '@/store';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useAppDispatch } from '@/hooks';
import { logOut } from '@/slices/authSlice';
import SearchBar from '../molecules/SearchBar';
import Footer from './Footer';
import { motion } from "motion/react"
import UIstyles from "@/styles/ui.module.css"
import ThemeButton from '../atoms/ThemeButton';
import AppImage from '../atoms/AppImage';
import { useSelector } from 'react-redux';

const NavBar = () => {
    const dispatch = useAppDispatch();
    const { loggedIn, authChecked } = useAuthStatus();
    const { avatar_url, id: authorId, username: author } = useSelector((state: RootState) => state.auth.user)
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function toggleTheme() {
        const root = document.documentElement;
        const current = root.getAttribute("data-theme");
        const next = current === "light" ? "dark" : "light";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    }

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

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
                transition={{ duration: 0.4 }}
            >
                <div className={`${styles.navContent} ${isMenuOpen ? styles.active : ''}`}>
                    <div className={styles.nav1}>
                        <AppLink className={styles.navButton} to="/home">Home</AppLink>
                        <AppLink className={styles.navButton} to="/home/posts">Posts</AppLink>
                        {loggedIn && <AppLink className={styles.navButton} to="dashboard">Dashboard</AppLink>}
                    </div>
                    {!isMenuOpen && <SearchBar />}
                    <div className={styles.themeWrapper}>
                        <ThemeButton onClick={toggleTheme} />
                    </div>

                    <div className={styles.nav1}>
                        {loggedIn && <AppLink className={styles.navButton} to="/home/profile">
                            <AppImage loading="lazy" onClick={() => navigate(`/home/profile/${authorId}`)} className={UIstyles.avatar} src={avatar_url} alt={`${author} avatar`} />
                            Profile</AppLink>}
                        <AppLink className={styles.navButton} to="/home/about">About</AppLink>
                        <AppLink to="/login" className={`${styles.navButton} ${UIstyles.danger}`} onClick={logOutHandler}>Log out</AppLink>
                    </div>
                </div>
                <div className={styles.hamburgerWrapper}>
                    <div className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className={isMenuOpen ? styles.barOpen : ''}></span>
                        <span className={isMenuOpen ? styles.barOpen : ''}></span>
                        <span className={isMenuOpen ? styles.barOpen : ''}></span>
                    </div>
                    <SearchBar />
                </div>
                
            </motion.nav>
            <Outlet />
            <Footer />
        </>
    )
}

export default NavBar