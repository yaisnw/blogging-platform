import AppButton from "../atoms/AppButton"
import styles from '../../styles/dashboardPage.module.css'
import { AnimatePresence, motion } from "motion/react";

type postPanelProps = {
    createButton: () => void;
    deleteButton: () => void;
    confirmDeleteButton: () => void;
    isDeleting: boolean,
    deletingPostIds: number[],
}

const PostPanel: React.FC<postPanelProps> = ({ createButton, deleteButton, confirmDeleteButton, isDeleting, deletingPostIds }) => {
    return (
        <motion.nav
            initial={{ opacity: 0.6, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={styles.panel}
            aria-label="Post actions">
            <AnimatePresence >
                <AppButton key="create-btn" onClick={createButton}>Create Post</AppButton>
                <AppButton key="delete-btn" variant={isDeleting ? "secondary" : "primary"}  onClick={deleteButton}>{isDeleting ? 'Cancel Delete' : 'Delete Posts'}</AppButton>
                {isDeleting && (
                    <motion.div
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1, }}
                        exit={{ opacity: 0, }}
                        transition={{ duration: 0.3 }}
                        key="confirm-delete-group"
                        className={styles.deleteWrapper}
                    >
                        <AppButton
                            className={styles.deleteButton}
                            variant="danger"
                            disabled={deletingPostIds.length === 0}
                            showDisabledPopup
                            onDisabledClick={() =>
                                alert("Select at least one post before deleting.")
                            }
                            onClick={confirmDeleteButton}
                        >
                            Delete Selected
                        </AppButton>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};


export default PostPanel;