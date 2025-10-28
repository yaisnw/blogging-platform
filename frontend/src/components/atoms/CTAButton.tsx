import AppLink from "./AppLink"
import styles from "@/styles/ui.module.css"

type CTAButtonProps = {
    to: string
} & React.HTMLAttributes<HTMLElement>;

const CTAButton: React.FC<CTAButtonProps> = ({children, to}) => {
    return (
        <AppLink className={styles.ctaButton} to={to}>
            → {children}
        </AppLink>
    )
}

export default CTAButton