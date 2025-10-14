import AppHeader from '../atoms/AppHeader'
import AppParagraph from '../atoms/AppParagraph'
import AppLink from '../atoms/AppLink'
import { useAuthStatus } from '@/hooks/useAuthStatus'

const HeroContent = (props: React.HTMLAttributes<HTMLElement>) => {
    const {loggedIn} = useAuthStatus();
    return (
        <section {...props}>
            <AppHeader>
                {loggedIn ? 'Discover New Voices' : 'Explore Inspiring Stories'}
            </AppHeader>
            <AppParagraph>
                {loggedIn
                    ? 'Read posts from writers across the platform and find inspiration in their stories.'
                    : 'Browse our community’s stories and discover what makes our platform special.'}
            </AppParagraph>
            <AppLink to={loggedIn ? '/home/posts' : '/posts'}>
                {loggedIn ? 'View Posts' : 'Start Reading'}
            </AppLink>
        </section>
    );
}

export default HeroContent
