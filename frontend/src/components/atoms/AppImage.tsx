import React from 'react';

type AppImageProps = React.HTMLProps<HTMLImageElement>;

const AppImage: React.FC<AppImageProps> = ({children, ...props}) => {
    return <img {...props}>{children}</img>
}

export default AppImage;