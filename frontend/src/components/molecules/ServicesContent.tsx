import AppHeader from '../atoms/AppHeader'
import AppParagraph from '../atoms/AppParagraph'
import AppLink from '../atoms/AppLink'

const UserContent = (props: React.HTMLAttributes<HTMLElement>) => {
    return (
        <article {...props}>
            <header>
                <AppHeader>Explore Author Profiles</AppHeader>
            </header>
            <AppParagraph>
                Create and customize your own profile, or browse others to get inspired.
            </AppParagraph>
            <AppLink to="/signup">Get Started</AppLink>
        </article>
    )
}

export default UserContent
