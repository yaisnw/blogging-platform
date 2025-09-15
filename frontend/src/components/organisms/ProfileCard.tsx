import AppImage from "../atoms/AppImage"

type ProfileCardProps = {
    username: string,
    email: string,
    avatar_url: string
}

const ProfileCard: React.FC<ProfileCardProps> = ({ username, email, avatar_url  }) => {
    return (
        <section>
            <AppImage src={avatar_url} />
            <div>
                <p>Username:</p>
                <h3>{username}</h3>
                <p>Email:</p>
                <p>{email}</p>
            </div>
        </section>
    )
}

export default ProfileCard