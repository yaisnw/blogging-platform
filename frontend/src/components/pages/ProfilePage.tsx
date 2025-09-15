import ProfileCard from "../organisms/ProfileCard"
import ProfileTemplate from "../templates/ProfileTemplate"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import styles from "@/styles/ui.module.css"
import { useNavigate } from "react-router"

const ProfilePage = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user)

    

    // if() {
    //     return (
    //         <div className={styles.loaderCenter}>
    //             <span className={styles.loader}></span>
    //         </div>
    //     );
    // }

    if (!user ) {
         return (
            <div className={styles.pageError}>
                <h1 className={styles.error}>Something went wrong while fetching the user.</h1>
                <button className={styles.ctaButton} onClick={() => window.location.reload()}>
                                    <p >Try again</p>
                                </button>
                <button onClick={() => navigate('/home')} className={styles.ctaButton}>
                    <p>View home page</p>
                </button>
            </div>
        )
    }

    return (
        <ProfileTemplate profileCard={<ProfileCard username={user?.username} avatar_url={user?.avatar_url} email={user?.email} />} userPosts={<div></div>}/>
    )
}
export default ProfilePage