import React from 'react';

type AppImageProps = React.HTMLProps<HTMLImageElement>;

const AppImage: React.FC<AppImageProps> = ({children, ...props}) => {
    return <img loading='lazy' {...props}>{children}</img>
}

export default AppImage;