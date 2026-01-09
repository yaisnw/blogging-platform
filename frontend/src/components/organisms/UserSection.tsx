import styles from '../../styles/home.module.css'
import UserContent from '../molecules/UserContent'
import AppImage from '../atoms/AppImage'
import { motion } from 'motion/react'
import userSvg from '@/assets/user.svg'

const UserSection = () => {
    return (
        <motion.section
            initial={{ opacity: 0, x: -700 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.contentBox}>
            <UserContent className={styles.homeContent} />
            <AppImage className={styles.contentImage} src={userSvg} alt="profile" />
        </motion.section>
    )
}

export default UserSection;