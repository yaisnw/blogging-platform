import AppParagraph from '../atoms/AppParagraph'
import AppLink from '../atoms/AppLink'
import { useAuthStatus } from '@/hooks/useAuthStatus';
import AppHeader from '../atoms/AppHeading';

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
            <AppLink to={loggedIn ? '/home/profile' : '/signup'}>
                {loggedIn ? 'Manage Profile' : 'Get Started'}
            </AppLink>
        </article>
    );
}

export default UserContent
