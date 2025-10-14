import React from 'react';
import styles from "@/styles/ui.module.css"

type AppParagraphProps = React.HTMLProps<HTMLParagraphElement>;

const AppParagraph: React.FC<AppParagraphProps> = ({children, ...props}) => {
    return <p className={styles.appParagraph} {...props}>{children}</p>
};

export default AppParagraph;