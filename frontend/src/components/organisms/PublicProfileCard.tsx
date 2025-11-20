import styles from "@/styles/profilePage.module.css"
import AppImage from "../atoms/AppImage"
import { useLocation, useNavigate } from "react-router"

type PublicProfileCardProps = {
    id: number,
    username: string,
    email: string,
    avatar_url: string,
}

const PublicProfileCard: React.FC<PublicProfileCardProps> = ({id, username, email, avatar_url}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const onSearchPage = location.pathname == "/home/search";
    return (
        <section onClick={() => onSearchPage ? navigate(`/home/profile/${id}`) : null} className={`${styles.publicProfileCard} ${onSearchPage && styles.clickableCard}`}>
                <AppImage className={styles.profilePicture} src={avatar_url} />
                <div className={styles.userInfoBox}>
                    <p>Username: <span className={styles.userName}>{username}</span></p>
                    <p>Email: <span className={styles.userDetail}>{email}</span></p>
                </div>

            </section>
    )
}

export default PublicProfileCard