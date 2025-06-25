import React from "react";

type AppButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const AppButton: React.FC<AppButtonProps> = ({children, ...props}) => {
    return (
        <button {...props}>
            {children}
        </button>
    )
}

export default AppButton