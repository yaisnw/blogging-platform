import AppLink from "../atoms/AppLink";
import styles from '../../styles/home.module.css';
import { useEffect, useState } from "react";

const Footer = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    useEffect(() => {
        const token = localStorage.getItem("token")
        if(token){
            setLoggedIn(true)
        }
        else {
            setLoggedIn(false)
        }
    })

    return (
        <footer className={styles.footer}>
            <nav className={styles.navSection}>
                <div className={styles.linkGroupLeft}>
                    <AppLink to="/home">Home</AppLink>
                    <AppLink to="/blogs">Blogs</AppLink>
                    {loggedIn ? <AppLink to="/profile">Profile</AppLink> : <AppLink to="/signup">Sign Up</AppLink>}
                </div>
                <div className={styles.linkGroupRight}>
                    <AppLink to="/support">Support</AppLink>
                    <AppLink to="/contact">Contact Us</AppLink>
                    <AppLink to="/about">About</AppLink>
                </div>
            </nav>
            <p className={styles.copy}>&copy; {new Date().getFullYear()} YourSiteName. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
