import React from 'react';
import styles from "@/styles/ui.module.css"

type AppInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const AppInput: React.FC<AppInputProps> = ({children, ...props}) => {
    return (
        <input className={styles.appInput} {...props}>
            {children}
        </input>
    )
}

export default AppInput;