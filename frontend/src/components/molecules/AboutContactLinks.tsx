import { LinkedInSVG, GithubSVG } from "../atoms/Icons";
import SocialButton from "../atoms/SocialButton";
import styles from "@/styles/about.module.css";

const AboutContactLinks = () => (
  <article>
    <div className={styles.aboutEmail}>
      <h3>Get in touch</h3>
      <a 
        href="mailto:eliteyasin1@gmail.com" 
        className={styles.contactLinks}
      >
        eliteyasin1@gmail.com
      </a>
    </div>

    <div className={styles.linksContainer}>
      <SocialButton 
        label="LinkedIn" 
        href="https://www.linkedin.com/in/yourprofile" 
        Icon={LinkedInSVG} 
      />
      
      <SocialButton 
        label="Github" 
        href="https://github.com/yourusername" 
        Icon={GithubSVG} 
      />
    </div>
  </article>
);

export default AboutContactLinks;