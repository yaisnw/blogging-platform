import AppParagraph from "../atoms/AppParagraph";
import AppLink from "../atoms/AppLink";
import UIstyles from "@/styles/ui.module.css"
import styles from "@/styles/about.module.css"

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
      <AppLink className={styles.contactLinks} to="https://github.com/yourusername" target="_blank" rel="noreferrer">
        <svg
          className={UIstyles.appImage}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor" fillRule="evenodd"
        >
          <path
            d="M10 0C4.48 0 0 4.59 0 10.253c0 4.53 2.86 8.374 6.83 9.73.5.1.68-.22.68-.49 0-.34-.01-1.44-.01-2.81C5 16.41 4.37 15.1 4.37 15.1c-.45-1.15-1.11-1.46-1.11-1.46-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.13-.25-4.37-1.09-4.37-4.86 0-1.07.37-1.95 1.03-2.63-.1-.26-.45-1.29.1-2.7 0 0 .84-.27 2.75 1.06A9.3 9.3 0 0 1 10 4.96c.85 0 1.7.11 2.5.33 1.91-1.33 2.75-1.06 2.75-1.06.55 1.41.2 2.44.1 2.7.64.68 1.03 1.56 1.03 2.63 0 3.78-2.25 4.61-4.39 4.86.36.32.68.95.68 1.92 0 1.39-.01 2.52-.01 2.87 0 .27.18.59.69.49A10.26 10.26 0 0 0 20 10.253C20 4.59 15.52 0 10 0z"
          />
        </svg>

        Github
      </AppLink >
      <AppLink className={styles.contactLinks}  to="https://github.com/yaisnw" target="_blank" rel="noreferrer">
        <svg
          className={UIstyles.appImage}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor" fillRule="evenodd"
        >
          <path d="M6.5 8A1.5 1.5 0 1 0 6.5 5 1.5 1.5 0 0 0 6.5 8Z" />
          <path d="M5 10c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-8Z" />
          <path d="M11 19h1c.55 0 1-.45 1-1v-4.5c0-1.5 3-2.5 3 0V18c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-6c0-2-1.5-3-3.5-3s-2.5 1.5-2.5 1.5V10c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1Z" />
          <path d="M4 1h16a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z" />
        </svg>

        LinkedIn
      </AppLink>
    </div>
  </article>
);

export default AboutContactLinks;
