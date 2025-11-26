import AppHeader from '../atoms/AppHeading'
import AppParagraph from '../atoms/AppParagraph'
import { useAuthStatus } from '@/hooks/useAuthStatus'
import CTAButton from '../atoms/CTAButton';

const ServicesContent = (props: React.HTMLAttributes<HTMLElement>) => {
    const { loggedIn } = useAuthStatus();

    return (
        <article {...props}>
            <div>
                <AppHeader>
                    {loggedIn ? 'Your Tools & Insights' : 'Discover Our Features'}
                </AppHeader>
                <AppParagraph>
                    {loggedIn
                        ? 'Access tools to write, edit, and track your posts — all in one place.'
                        : 'Explore features that make writing, sharing, and connecting effortless.'}
                </AppParagraph>
            </div>
            <CTAButton to={loggedIn ? '/home/dashboard' : '/signup'}>
                {loggedIn ? 'Go to Dashboard' : 'Get Started'}
            </CTAButton>
        </article>
    );
};

export default ServicesContent;
