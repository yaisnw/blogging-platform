import React from "react";
import styles from "@/styles/ui.module.css";

type Variant = "primary" | "secondary" | "danger";

type AppButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  showDisabledPopup?: boolean;
  onDisabledClick?: () => void;
};

const AppButton: React.FC<AppButtonProps> = ({
    className = "",
    variant = "primary",
    disabled,
    showDisabledPopup = false,
    onDisabledClick,
    onClick,
    children,
    ...props
}) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
            if (showDisabledPopup && onDisabledClick) {
                e.preventDefault();
                e.stopPropagation();
                onDisabledClick();
            }
            return; 
        }
        onClick?.(e);
    };

    return (
        <button
            className={`${styles.appButton} ${styles[variant]} ${className}`}
            disabled={disabled}
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default AppButton;
