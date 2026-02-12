import AppHeadingTwo from "../atoms/AppHeadingTwo"
import AppParagraph from "../atoms/AppParagraph"
import styles from "@/styles/auth.module.css"

const LoginSampleComponent = () => {
    return (
        <article className={styles.loginSampleContainer}>
            <AppHeadingTwo>Sample User:</AppHeadingTwo>
            <AppParagraph>Email: <span>elite123@sample.com</span></AppParagraph>
            <AppParagraph>Password: <span>123elite321</span></AppParagraph>
        </article>
    )
}

export default LoginSampleComponent