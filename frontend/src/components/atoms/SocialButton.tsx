import AppLink from "./AppLink";
import styles from "@/styles/footer.module.css";
import UIstyles from "@/styles/ui.module.css";

type SocialButtonProps = {
  href: string;
  label: string;
  children: React.ReactNode; // This will be your SVG path
};

const SocialButton = ({ href, label, children }: SocialButtonProps) => {
  return (
    <AppLink 
      className={styles.socialLink} 
      to={href} 
      target="_blank" 
      rel="noreferrer"
    >
      <svg
        className={UIstyles.appImage}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor" 
        fillRule="evenodd"
      >
        {children}
      </svg>
      <span>{label}</span>
    </AppLink>
  );
};

export default SocialButton;