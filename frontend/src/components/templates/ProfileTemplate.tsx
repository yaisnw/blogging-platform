import styles from "@/styles/profilePage.module.css"

type ProfileTemplateProps = {
    profileCard: React.ReactNode;
    tabPanel: React.ReactNode;
    tabContent: React.ReactNode;
};

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({ profileCard, tabPanel, tabContent }) => {
    return (
        <main className={styles.profileContainer}>
            {profileCard}
            <nav>{tabPanel}</nav>
            <section>{tabContent}</section>
        </main>
    );
};

export default ProfileTemplate;
