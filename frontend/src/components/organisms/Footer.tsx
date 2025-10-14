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
    }, [setLoggedIn])

    return (
        <footer className={styles.footer}>
            <nav className={styles.navSection}>
                <ul className={styles.linkGroupLeft}>
                    <li><AppLink to="/home">Home</AppLink></li>
                    <li><AppLink to="/home/posts">Posts</AppLink></li>
                    {loggedIn ? <li><AppLink to="/home/profile">Profile</AppLink></li> : <li><AppLink to="/signup">Sign Up</AppLink></li>}
                </ul>
                <ul className={styles.linkGroupRight}>
                    <li><AppLink to="/support">Support</AppLink></li>
                    <li><AppLink to="/contact">Contact Us</AppLink></li>
                    <li><AppLink to="/about">About</AppLink></li>
                </ul>
            </nav>
            <p className={styles.copy}>&copy; {new Date().getFullYear()} YourSiteName. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
