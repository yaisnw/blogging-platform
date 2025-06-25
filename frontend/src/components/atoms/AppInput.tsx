import React from 'react';

type AppInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const AppInput: React.FC<AppInputProps> = ({children, ...props}) => {
    return (
        <input {...props}>
            {children}
        </input>
    )
}

export default AppInput;