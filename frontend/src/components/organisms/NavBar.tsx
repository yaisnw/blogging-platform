import AppLink from '../atoms/AppLink';
import { Outlet, useNavigate, useLocation } from 'react-router';
import styles from '../../styles/nav.module.css'
import { useState, useEffect } from 'react';
import { persistor, type RootState } from '@/store';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useAppDispatch } from '@/hooks';
import SearchBar from '../molecules/SearchBar';
import Footer from './Footer';
import { AnimatePresence, motion } from "motion/react"
import UIstyles from "@/styles/ui.module.css"
import ThemeButton from '../atoms/ThemeButton';
import AppImage from '../atoms/AppImage';
import { useSelector } from 'react-redux';
import { useGetUserQuery } from '@/services/userApi';
import AppLoader from '../atoms/AppLoader';
import AlertButton from '../atoms/AlertButton';
import CrossButton from '../atoms/CrossButton';
import { setAlertIgnored } from '@/slices/uiSlice';
import { useIsDesktop } from '@/hooks/useIsDesktop';

const NavBar = () => {
    const dispatch = useAppDispatch();
    const { loggedIn } = useAuthStatus();
    const { id: authorId, username: author } = useSelector((state: RootState) => state.auth.user)
    const alertIgnored = useSelector((state: RootState) => state.ui.alertIgnored)
    const navigate = useNavigate();
    const location = useLocation();
    const isOnDashboardPage = location.pathname.includes('/dashboard')
    const { data, isLoading } = useGetUserQuery(authorId);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [alertClicked, setAlertClicked] = useState(false);
    const isDesktop = useIsDesktop();

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


    const logOutHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('token')
        persistor.purge();
        navigate('/login')
    }
    const toggleAlert = () => {
        setAlertClicked(!alertClicked);
    }
    return (
        <>

            {isLoading && <AppLoader mode="page" />}
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
                            <AppImage loading="lazy" onClick={() => navigate(`/home/profile/${authorId}`)} className={UIstyles.interactiveAvatar} src={data?.avatar_url} alt={`${author} avatar`} />
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
            <div className={styles.alertWrapper}>
                <AnimatePresence>
                    {!alertIgnored && !isDesktop && (
                        <motion.div
                            key="universal-mobile-alert"
                            onClick={toggleAlert}
                            className={isOnDashboardPage ? styles.mobileWarningButton : styles.mobileAlertButton}
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <AlertButton />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {alertClicked && !alertIgnored && (
                        <motion.div
                            key="alert-message"
                            className={isOnDashboardPage ? styles.mobileWarning : styles.mobileAlert}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 200 }}
                        >
                            {!isOnDashboardPage && (
                                <CrossButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(setAlertIgnored(true));
                                    }}
                                    className={styles.mobileAlertIgnore}
                                />
                            )}
                            <p>
                                {window.innerWidth < 300
                                    ? (isOnDashboardPage ? "Desktop Required" : "Use Desktop View")
                                    : (isOnDashboardPage
                                        ? "Caution: Dashboard editing is not optimized for mobile."
                                        : "For the best experience, please view this site on a desktop device.")
                                }
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Outlet />
            <Footer />
        </>
    )
}

export default NavBar