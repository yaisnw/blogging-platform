import AppParagraph from "../atoms/AppParagraph";
import AppLink from "../atoms/AppLink";
import UIstyles from "@/styles/ui.module.css"
import styles from "@/styles/about.module.css"
import { GithubSVG, LinkedInSVG } from "../atoms/Icons";

const AboutContactLinks = () => (
  <article >
    <AppParagraph className={styles.aboutEmail}>
      Want to get in touch? Reach me at:
      <br />
      <AppLink to="mailto:eliteyasin1@gmail.com">
        eliteyasin1@gmail.com
      </AppLink>
    </AppParagraph>
    <div className={UIstyles.divider}><span>or</span></div>
    <div className={styles.linksContainer}>

      <LinkedInSVG className={styles.contactIcon} />
      <GithubSVG className={styles.contactIcon} />
    </div>
  </article>
);

export default AboutContactLinks;
