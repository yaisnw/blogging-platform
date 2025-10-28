import styles from '@/styles/ui.module.css';
import { motion } from 'motion/react'

type LoaderMode = "page" | "normal" | "mini";

type AppLoaderProps = {
    mode?: LoaderMode;
} & React.HTMLAttributes<HTMLDivElement>

const AppLoader = ({ mode = "normal" }: AppLoaderProps) => {
    if (mode === "page") {
        return (
            <div className={styles.loaderPageWrapper}>
                <span className={`${styles.loader} ${styles.loaderNormal}`}></span>
            </div>
        );
    }

    if (mode === "mini") {
        return (
            <div className={styles.loaderMiniWrapper}>
                <span className={`${styles.loader} ${styles.loaderMini}`}></span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 0.5 }}
            className={styles.loaderNormalWrapper}>
            <span className={`${styles.loader} ${styles.loaderNormal}`}></span>
        </motion.div>
    );
};

export default AppLoader;
