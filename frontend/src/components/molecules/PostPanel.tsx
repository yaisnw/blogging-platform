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

            className={styles.panel} aria-label="Post actions">
            <AppButton onClick={createButton}>Create Post</AppButton>
            <AppButton onClick={deleteButton}>{isDeleting ? 'Cancel Delete' : 'Delete Posts'}</AppButton>
            <AnimatePresence>
                {isDeleting && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <AppButton
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