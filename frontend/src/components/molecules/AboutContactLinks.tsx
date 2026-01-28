import { LinkedInSVG, GithubSVG } from "../atoms/Icons";
import SocialButton from "../atoms/SocialButton";
import styles from "@/styles/about.module.css"

const AboutContactLinks = () => (
  <article>
    {/* ... email section ... */}
    
    <div className={styles.linksContainer}>
      <SocialButton 
        label="LinkedIn" 
        href="https://www.linkedin.com/..." 
        Icon={LinkedInSVG} 
      />
      
      <SocialButton 
        label="Github" 
        href="https://github.com/..." 
        Icon={GithubSVG} 
      />
    </div>
  </article>
);

export default AboutContactLinks