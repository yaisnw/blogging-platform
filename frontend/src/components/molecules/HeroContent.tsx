import AppHeader from '../atoms/AppHeader';
import AppParagraph from '../atoms/AppParagraph';
import type React from 'react';
import AppLink from '../atoms/AppLink';

type AppHeroContentProps = React.HTMLProps<HTMLDivElement>;

const HeroContent: React.FC<AppHeroContentProps> = ({ ...props }) => {
    return (
        <div {...props}>
            <AppHeader>Share Your Story with others.</AppHeader>
            <AppParagraph>Create personalized blog posts with rich formatting and image uploads — all in one place.</AppParagraph>
            <AppLink to='/signup'>Get Started</AppLink>
        </div>
    )
}

export default HeroContent