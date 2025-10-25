import AppImage from "../atoms/AppImage";
import styles from '../../styles/home.module.css'
import ServicesContent from "../molecules/ServicesContent";
import { motion } from "motion/react";

const ServicesSection = () => {
    return (
        <motion.section
            initial={{ opacity: 0, x: 700 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.contentBox}>
            <AppImage src='/service.svg' alt="text and image customisation" className={styles.contentImage} />
            <ServicesContent className={styles.homeContent} />
        </motion.section>
    )
}

export default ServicesSection;