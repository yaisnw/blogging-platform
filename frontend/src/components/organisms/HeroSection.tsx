import AppImage from "../atoms/AppImage"
import HeroContent from "../molecules/HeroContent"
import styles from '../../styles/home.module.css'

const HeroSection = ({ }) => {
    return (
        <section className={styles.contentBox}>
            <HeroContent className={styles.homeContent} />
            <AppImage src='/hero.svg' alt="Person typing on a keyboard" />
        </section>
    )
}

export default HeroSection;