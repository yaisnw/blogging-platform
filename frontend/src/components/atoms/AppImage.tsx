import React from 'react';
import styles from "@/styles/ui.module.css"

type AppImageProps = React.HTMLProps<HTMLImageElement>;

const AppImage: React.FC<AppImageProps> = ({children, ...props}) => {
    return <img className={styles.appImage} loading='lazy' {...props}>{children}</img>
}

export default AppImage;