import AppLink from "./AppLink";
import styles from "@/styles/about.module.css";

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
      <Icon className={styles.contactIcon} />
      <span>{label}</span>
    </AppLink>
  );
};

export default SocialButton;