type ProfileTemplateProps = {
    profileCard: React.ReactNode,
    tabPanel: React.ReactNode,
    tabContent: React.ReactNode,
}

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({profileCard, tabPanel, tabContent}) => {
    return (
        <div>
            {profileCard}
            {tabPanel}
            {tabContent}

        </div>
    )
}
export default ProfileTemplate