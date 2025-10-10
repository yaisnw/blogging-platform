import AppHeader from '../atoms/AppHeader'
import AppParagraph from '../atoms/AppParagraph'
import AppLink from '../atoms/AppLink'

const HeroContent = (props: React.HTMLAttributes<HTMLElement>) => {
    return (
        <article {...props}>
            <header>
                <AppHeader>Share Your Story with others.</AppHeader>
            </header>
            <AppParagraph>
                Create personalized blog posts with rich formatting and image uploads, all in one place.
            </AppParagraph>
            <AppLink to="/signup">Get Started</AppLink>
        </article>
    )
}

export default HeroContent
