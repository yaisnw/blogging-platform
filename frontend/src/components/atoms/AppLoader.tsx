import styles from '@/styles/ui.module.css';

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
        <div className={styles.loaderNormalWrapper}>
            <span className={`${styles.loader} ${styles.loaderNormal}`}></span>
        </div>
    );
};

export default AppLoader;
