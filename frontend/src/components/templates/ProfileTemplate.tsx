type ProfileTemplateProps = {
    profileCard: React.ReactNode;
    tabPanel: React.ReactNode;
    tabContent: React.ReactNode;
};

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({ profileCard, tabPanel, tabContent }) => {
    return (
        <main>
            {profileCard}
            <nav>{tabPanel}</nav>
            <section>{tabContent}</section>
        </main>
    );
};

export default ProfileTemplate;
