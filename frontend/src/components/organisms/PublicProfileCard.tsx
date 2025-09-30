import styles from "@/styles/profilePage.module.css"
import AppImage from "../atoms/AppImage"

type PublicProfileCardProps = {
    id: number,
    username: string,
    email: string,
    avatar_url: string,
}

const PublicProfileCard: React.FC<PublicProfileCardProps> = ({username, email, avatar_url}) => {
    return (
        <section className={styles.profileCard}>
                <AppImage className={styles.profilePicture} src={avatar_url} />
                <div className={styles.userInfoBox}>
                    <p>Username: <span className={styles.userInfo}>{username}</span></p>
                    <p>Email: <span className={styles.userInfo}>{email}</span></p>
                </div>

            </section>
    )
}

export default PublicProfileCard