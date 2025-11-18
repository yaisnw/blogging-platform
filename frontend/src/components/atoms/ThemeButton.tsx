import React from 'react';
import styles from "@/styles/ui.module.css"

type ThemeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const ThemeButton: React.FC<ThemeButtonProps> = ({...props}) => {
    return (
        <button {...props} id="theme-toggle" className={styles.themeToggle} aria-label="Toggle theme">
            <span className={`${styles.toggleCircle} ${styles.Blue}`}></span>
            <span className={`${styles.toggleCircle} ${styles.Black}`}></span>
        </button>
    );
};

export default ThemeButton;
