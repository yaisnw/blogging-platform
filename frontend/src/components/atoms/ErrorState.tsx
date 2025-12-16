import styles from "@/styles/ui.module.css";
import { motion } from "motion/react";
import AppButton from "./AppButton";


type ErrorMode = "page" | "normal";

type ErrorStateProps = {
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
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={wrapperClass}>
      <h1 className={styles.error}>{message}</h1>
      <div className={styles.componentError}>
        {onRetry && (
          <AppButton onClick={onRetry}>
            <p>Try again</p>
          </AppButton>
        )}
        {onAction && actionLabel && (
          <AppButton onClick={onAction}>
            <p>{actionLabel}</p>
          </AppButton>
        )}
      </div>
    </motion.div>
  );
}
