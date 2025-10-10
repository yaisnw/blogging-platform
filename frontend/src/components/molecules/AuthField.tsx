import React from "react";
import AppLabel from "../atoms/AppLabel";
import AppInput from "../atoms/AppInput";

type AuthFieldProps = {
    label: string,
    name: string,

} & React.InputHTMLAttributes<HTMLInputElement>;

const AuthField: React.FC<AuthFieldProps> = ({ name, label, ...props }) => {
    return (
        <fieldset>
            <legend className="visually-hidden">{label}</legend>
            <div>
                <AppLabel htmlFor={name}>{label}</AppLabel>
                <AppInput id={name} name={name} type="text" {...props} />
            </div>
        </fieldset>
    );
};

export default AuthField;