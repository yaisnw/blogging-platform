import AppImage from "../atoms/AppImage"
import HeroContent from "../molecules/HeroContent"
import styles from '../../styles/home.module.css'
import { motion } from "motion/react"
import heroSvg from '@/assets/hero.svg'

const HeroSection = () => {
    return (
        <motion.header
            initial={{ opacity: 0, x: -700 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.contentBox}>
            <HeroContent className={styles.homeContent} />
            <AppImage className={styles.contentImage} src={heroSvg} alt="Person typing on a keyboard" />
        </motion.header>
    )
}

export default HeroSection;