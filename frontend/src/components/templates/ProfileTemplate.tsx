type ProfileTemplateProps = {
    profileCard: React.ReactNode,
    userPosts: React.ReactNode[] | React.ReactNode
}

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({profileCard, userPosts}) => {
    return (
        <div>
            {profileCard}
            {userPosts}
        </div>
    )
}
export default ProfileTemplate