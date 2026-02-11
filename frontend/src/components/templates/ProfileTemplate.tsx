import styles from "@/styles/profilePage.module.css"

type ProfileTemplateProps = {
    profileCard: React.ReactNode;
    tabPanel: React.ReactNode;
    tabContent: React.ReactNode;
};

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({ profileCard, tabPanel, tabContent }) => {
    return (
        <article className={styles.profileContainer}>
            {profileCard}
            <nav>{tabPanel}</nav>
            <section className={styles.userPostCardBox}>{tabContent}</section>
        </article>
    );
};

export default ProfileTemplate;
