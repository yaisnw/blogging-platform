import AppImage from "../atoms/AppImage"
import HeroContent from "../molecules/HeroContent"
import styles from '../../styles/home.module.css'

const HeroSection = ({ }) => {
    return (
        <section className={styles.hero}>
            <HeroContent />
            <AppImage src='/typing.svg' alt="Person typing on a keyboard" />
        </section>
    )
}

export default HeroSection;