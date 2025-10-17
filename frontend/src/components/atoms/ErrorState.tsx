import styles from "@/styles/ui.module.css";

type ErrorMode = "page" | "normal";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  mode?: ErrorMode;
}

export default function ErrorState({
  message,
  onRetry,
  actionLabel,
  onAction,
  mode = "page",
}: ErrorStateProps) {
  const wrapperClass =
    mode === "page" ? styles.pageError : styles.componentErrorWrapper;

  return (
    <div className={wrapperClass}>
      <h1 className={styles.error}>{message}</h1>
      <div className={styles.componentError}>
        {onRetry && (
          <button className={styles.ctaButton} onClick={onRetry}>
            <p>Try again</p>
          </button>
        )}
        {onAction && actionLabel && (
          <button className={styles.ctaButton} onClick={onAction}>
            <p>{actionLabel}</p>
          </button>
        )}
      </div>
    </div>
  );
}
