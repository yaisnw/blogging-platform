import styles from '../../styles/home.module.css'
import UserContent from '../molecules/UserContent'
import AppImage from '../atoms/AppImage'

const UserSection = ({}) => {
    return (
        <section className={styles.contentBox}>
            <UserContent className={styles.homeContent}/>
            <AppImage className={styles.contentImage} src='/profile.svg' alt="profile" />
        </section>
    )
}

export default UserSection;