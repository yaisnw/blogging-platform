import React from "react";
import AppLabel from "../atoms/AppLabel";
import AppInput from "../atoms/AppInput";
import styles from "@/styles/auth.module.css"

type AuthFieldProps = {
    label?: string,
    name: string,

} & React.InputHTMLAttributes<HTMLInputElement>;

const AuthField: React.FC<AuthFieldProps> = ({ name, label, ...props }) => {
    return (
        <fieldset className={styles.authFieldContainer}>
            <legend className={styles.visuallyHidden}>{label}</legend>
            <div className={styles.authField}>
                {label && <AppLabel htmlFor={name} className={styles.authLabel}>{label}</AppLabel>}
                <AppInput id={name} name={name} type="text" {...props} />
            </div>
        </fieldset>
    );
};

export default AuthField;