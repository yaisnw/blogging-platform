import AppHeader from '../atoms/AppHeader'
import AppParagraph from '../atoms/AppParagraph'
import AppLink from '../atoms/AppLink'
import { useAuthStatus } from '@/hooks/useAuthStatus'

const ServicesContent = (props: React.HTMLAttributes<HTMLElement>) => {
    const { loggedIn } = useAuthStatus();

    return (
        <article {...props}>
            <header>
                <AppHeader>
                    {loggedIn ? 'Your Tools & Insights' : 'Discover Our Features'}
                </AppHeader>
            </header>
            <AppParagraph>
                {loggedIn
                    ? 'Access tools to write, edit, and track your posts — all in one place.'
                    : 'Explore features that make writing, sharing, and connecting effortless.'}
            </AppParagraph>
            <AppLink to={loggedIn ? '/home/dashboard' : '/signup'}>
                {loggedIn ? 'Go to Dashboard' : 'Get Started'}
            </AppLink>
        </article>
    );
};

export default ServicesContent;
