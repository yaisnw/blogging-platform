import React from 'react'
import { Link } from 'react-router-dom';
import styles from "@/styles/ui.module.css"

import type { LinkProps } from "react-router-dom";

type AppLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
};
const AppLink: React.FC<AppLinkProps> = ({ to, children, className, ...props }) => {
  return (
    <Link to={to} {...props} className={`${styles.appLink} ${className || ""}`}>
      {children}
    </Link>
  );
};
export default AppLink