import AppImage from "../atoms/AppImage"
import HeroContent from "../molecules/HeroContent"
import styles from '../../styles/home.module.css'

const HeroSection = () => {
    return (
        <header className={styles.contentBox}>
            <HeroContent className={styles.homeContent} />
            <AppImage src='/hero.svg' alt="Person typing on a keyboard" />
        </header>
    )
}

export default HeroSection;