import AppImage from "../atoms/AppImage";
import styles from '../../styles/home.module.css'
import ServicesContent from "../molecules/ServicesContent";


const ServicesSection = () => {
    return (
        <section className={styles.contentBox}>
            <AppImage src='/service.svg' alt="text and image customisation" className={styles.contentImage} />
            <ServicesContent className={styles.homeContent} />
        </section>
    )
}

export default ServicesSection;