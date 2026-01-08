import styles from "@/styles/ui.module.css";
import { motion } from "motion/react";
import AppButton from "./AppButton";

type SuccessMode = "page" | "normal" | "mini";

type SuccessStateProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  mode?: SuccessMode;
}

export default function SuccessState({
  message,
  actionLabel,
  onAction,
  mode = "page",
}: SuccessStateProps) {
  const wrapperClass =
    mode === "page" 
      ? styles.pageSuccessWrapper 
      : (mode === "mini" ? styles.miniSuccessWrapper : styles.componentSuccessWrapper);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={wrapperClass}
    >
      <h1 className={styles.successText}>{message}</h1>
      
      {onAction && actionLabel && (
        <div className={styles.componentSuccess}>
          <AppButton onClick={onAction}>
            <p>{actionLabel}</p>
          </AppButton>
        </div>
      )}
    </motion.div>
  );
}