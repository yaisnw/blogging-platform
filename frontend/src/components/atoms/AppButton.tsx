import React from "react";
import styles from "@/styles/ui.module.css";

type AppButtonProps = {
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const AppButton: React.FC<AppButtonProps> = ({
    className,      
    children,
    ...props
}) => {
    return (
        <button
            className={`${styles.appButton} ${className || ""}`}   
            {...props}
        >
            {children}
        </button>
    );
};

export default AppButton;
