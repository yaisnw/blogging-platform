import AppHeader from "../atoms/AppHeader";
import AppLink from "../atoms/AppLink";
import AppParagraph from "../atoms/AppParagraph";

type AppUserContentProps = React.HTMLProps<HTMLDivElement>;

const UserContent: React.FC<AppUserContentProps> = ({ ...props }) => {
    return (
        <div {...props}>
            <AppHeader>Explore Author Profiles</AppHeader>
            <AppParagraph>Create and customize your own profile, or browse others to get inspired.</AppParagraph>
            <AppLink to='signup'>Get Started</AppLink>
        </div>
    )
}

export default UserContent;