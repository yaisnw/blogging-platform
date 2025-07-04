import React from 'react'
import { Link } from 'react-router-dom';

type AppLinkProps = {
    to: string
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const AppLink: React.FC<AppLinkProps> = ({ to, children, ...props}) => {
    return (
        <Link {...props} to={to}>
            {children}
        </Link>
    )
}
export default AppLink