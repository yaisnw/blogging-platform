import AppHeader from '../atoms/AppHeader';
import AppParagraph from '../atoms/AppParagraph';
import AppButton from '../atoms/AppButton';
import type React from 'react';

type AppHeroContentProps = React.HTMLProps<HTMLDivElement>;

const HeroContent: React.FC<AppHeroContentProps> = ({ ...props }) => {
    return (
        <div {...props}>
            <AppHeader>Write your own blog and post on our website!</AppHeader>
            <AppParagraph>Our website enables users to write personal blog posts with detailed customization and image uploading.</AppParagraph>
            <AppButton>Get Started</AppButton>
        </div>
    )
}

export default HeroContent