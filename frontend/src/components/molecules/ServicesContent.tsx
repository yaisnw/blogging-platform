import AppHeader from '../atoms/AppHeader';
import AppLink from '../atoms/AppLink';
import AppParagraph from '../atoms/AppParagraph';
import type React from 'react';

type AppServiceContentProps = React.HTMLProps<HTMLDivElement>;

const ServiceContent: React.FC<AppServiceContentProps> = ({ ...props }) => {
    return (
        <div {...props}>
            <AppHeader>Fast, Elegant Text Styling with Image Uploads</AppHeader>
            <AppParagraph>
                Customize your blog with sleek, responsive text formatting and seamlessly upload images to enhance your content.
            </AppParagraph>
            <AppLink to="../blogs">See Examples</AppLink>
        </div>
    )
}

export default ServiceContent;