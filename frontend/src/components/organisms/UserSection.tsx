import styles from '../../styles/home.module.css'
import UserContent from '../molecules/UserContent'
import AppImage from '../atoms/AppImage'
import { motion } from 'motion/react'

const UserSection = () => {
    return (
        <motion.section
            initial={{ opacity: 0, x: -700 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.contentBox}>
            <UserContent className={styles.homeContent} />
            <AppImage className={styles.contentImage} src='/profile.svg' alt="profile" />
        </motion.section>
    )
}

export default UserSection;