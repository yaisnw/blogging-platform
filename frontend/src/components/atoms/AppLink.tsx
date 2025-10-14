import React from 'react'
import { Link } from 'react-router-dom';
import styles from "@/styles/ui.module.css"

type AppLinkProps = {
    to: string
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const AppLink: React.FC<AppLinkProps> = ({ to, children, ...props}) => {
    return (
        <Link className={styles.appLink} {...props} to={to}>
            {children}
        </Link>
    )
}
export default AppLink