import React from "react";

type AppButtonProps = {
    imageClass?: string;
    imageSrc?: string;
    alt?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const AppButton: React.FC<AppButtonProps> = ({ imageClass, imageSrc, alt, children, ...props }) => {
    return (
        <button {...props}>
            {imageSrc ? <img src={imageSrc} alt={alt} className={imageClass} /> : children}
        </button>
    )
}

export default AppButton