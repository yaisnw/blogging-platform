import React from "react";

type AppButtonProps = {
    imageContainer?: string;
    imageClass?: string;
    imageSrc?: string;
    alt?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const AppButton: React.FC<AppButtonProps> = ({ imageContainer, imageClass, imageSrc, alt, children, ...props }) => {
    return (
        <button {...props}>
            {imageSrc ? 
                <div className={imageContainer}>
                    <img loading="lazy" src={imageSrc} alt={alt} className={imageClass} />
                    <p>Login with Google</p>
                </div>
             : children}
        </button>
    )
}

export default AppButton