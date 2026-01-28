import AppLink from "./AppLink";
import styles from "@/styles/footer.module.css";
import UIstyles from "@/styles/ui.module.css";

type SocialButtonProps = {
  href: string;
  label: string;
  Icon: React.ElementType; 
};

const SocialButton = ({ href, label, Icon }: SocialButtonProps) => {
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
      >
        <Icon />
      </svg>
      <span>{label}</span>
    </AppLink>
  );
};

export default SocialButton;