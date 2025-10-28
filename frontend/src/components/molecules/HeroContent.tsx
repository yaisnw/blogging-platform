import AppHeader from '../atoms/AppHeading'
import AppParagraph from '../atoms/AppParagraph'
import { useAuthStatus } from '@/hooks/useAuthStatus'
import CTAButton from '../atoms/CTAButton'

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
            <CTAButton to={loggedIn ? '/home/posts' : '/posts'}>
                {loggedIn ? 'View Posts' : 'Start Reading'}
            </CTAButton>
        </section>
    );
}

export default HeroContent
