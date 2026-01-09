import AppParagraph from "../atoms/AppParagraph";
import AppLink from "../atoms/AppLink";
import UIstyles from "@/styles/ui.module.css"
import styles from "@/styles/about.module.css"
import SocialButton from "../atoms/SocialButton";

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

      <SocialButton label="LinkedIn" href="https://www.linkedin.com/in/yasin-wafazada-109977286/" children={<><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5S0 4.881 0 3.5 1.11 1 2.5 1s2.48 1.119 2.48 2.5zM.5 8.98h4v12.02h-4V8.98zm7.982 0h3.838v1.641h.054c.535-1.012 1.842-2.082 3.793-2.082 4.056 0 4.803 2.669 4.803 6.135v6.326h-4v-5.604c0-1.337-.025-3.059-1.864-3.059-1.864 0-2.149 1.454-2.149 2.955v5.708h-4V8.98z" /></>} />
      <SocialButton label="Github" href="https://github.com/yaisnw" children={<><path d="M6.5 8A1.5 1.5 0 1 0 6.5 5 1.5 1.5 0 0 0 6.5 8Z" /><path d="M5 10c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-8Z" /><path d="M11 19h1c.55 0 1-.45 1-1v-4.5c0-1.5 3-2.5 3 0V18c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-6c0-2-1.5-3-3.5-3s-2.5 1.5-2.5 1.5V10c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1Z" /><path d="M4 1h16a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z" /></>} />
    </div>
  </article>
);

export default AboutContactLinks;
