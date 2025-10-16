import AppParagraph from "../atoms/AppParagraph";
import AppLink from "../atoms/AppLink";
import UIstyles from "@/styles/ui.module.css"
import styles from "@/styles/about.module.css"
import AppImage from "../atoms/AppImage";

const AboutContactLinks = () => (
  <div >
    <AppParagraph>
      Want to get in touch? Reach me at:
      <br />
      <AppLink to="mailto:eliteyasin1@gmail.com">
        eliteyasin1@gmail.com
      </AppLink>
    </AppParagraph>
    <div className={UIstyles.divider}><span>or</span></div>
    <div className={styles.linksContainer}>
      <AppLink to="https://github.com/yourusername" target="_blank" rel="noreferrer">
      <AppImage src="/github.svg" />
        GitHub
      </AppLink>
      <AppLink to="https://github.com/yaisnw" target="_blank" rel="noreferrer">
      <AppImage src="/linkedin.svg" />
        LinkedIn
      </AppLink>
    </div>
  </div>
);

export default AboutContactLinks;
