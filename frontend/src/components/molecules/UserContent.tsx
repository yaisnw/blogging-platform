import AppParagraph from '../atoms/AppParagraph'
import { useAuthStatus } from '@/hooks/useAuthStatus';
import AppHeader from '../atoms/AppHeading';
import CTAButton from '../atoms/CTAButton';

const UserContent = (props: React.HTMLAttributes<HTMLElement>) => {
    const { loggedIn } = useAuthStatus();
     return (
        <article {...props}>
            <header>
                <AppHeader>
                    {loggedIn ? 'Your Profile' : 'Create Your Profile'}
                </AppHeader>
            </header>
            <AppParagraph>
                {loggedIn
                    ? 'Personalize your profile and showcase your writing journey to the community.'
                    : 'Build your author profile to share your stories and connect with readers.'}
            </AppParagraph>
            <CTAButton to={loggedIn ? '/home/profile' : '/signup'}>
                {loggedIn ? 'Manage Profile' : 'Get Started'}
            </CTAButton>
        </article>
    );
}

export default UserContent
