import styles from '../../styles/footer.module.css';
import { motion } from "motion/react";
import AppLink from '../atoms/AppLink';


const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} 
            className={styles.footerSlim}>
            <div className={styles.container}>
                <div className={styles.brandSide}>
                    <p className={styles.logoText}>Blogger</p>
                    <span className={styles.divider}>|</span>
                    <p className={styles.copy}>&copy; {new Date().getFullYear()}</p>
                </div>
                
                <div className={styles.linkSide}>
                    <AppLink to="https://www.linkedin.com/in/yasin-wafazada-109977286/">LinkedIn</AppLink>
                    <AppLink to="https://github.com/yaisnw">Github</AppLink>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
