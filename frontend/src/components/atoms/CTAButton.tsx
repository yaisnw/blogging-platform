import { Link } from "react-router";
import styles from "@/styles/ui.module.css"

type CTAButtonProps = {
    to: string
} & React.HTMLAttributes<HTMLElement>;

const CTAButton: React.FC<CTAButtonProps> = ({children, to}) => {
    return (
        <Link className={styles.ctaButton} to={to}>
            → {children}
        </Link>
    )
}

export default CTAButton