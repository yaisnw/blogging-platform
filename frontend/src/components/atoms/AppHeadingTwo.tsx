import React from 'react';
import styles from "@/styles/ui.module.css"

type AppHeadingTwoProps = React.HTMLProps<HTMLHeadingElement>;

const AppHeadingTwo: React.FC<AppHeadingTwoProps> = ({ children, ...props}) => {
    return <h2 className={styles.headingTwo} {...props}>{children}</h2>
};

export default AppHeadingTwo;