import AppButton from "../atoms/AppButton"
import styles from '../../styles/postPanel.module.css'
import { AnimatePresence, motion } from "motion/react";
import AppHeadingTwo from "../atoms/AppHeadingTwo";
import PlusSVG from "../atoms/PlusSVG";
import TrashSVG from "../atoms/TrashSVG";

type postPanelProps = {
    createButton: () => void;
    deleteButton?: () => void;
    confirmDeleteButton?: () => void;
    isDeleting?: boolean;
    deletingPostIds?: number[];
    onSortChange: (val: string) => void;
    isDashboard?: boolean;
}

const PostPanel: React.FC<postPanelProps> = ({
    createButton,
    deleteButton,
    confirmDeleteButton,
    isDeleting,
    deletingPostIds,
    onSortChange,
    isDashboard
}) => {
    return (
        <motion.nav
            initial={{ opacity: 0.6, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={styles.panel}
            aria-label="Post actions">

            <div className={styles.actionSection}>
                <AnimatePresence mode="popLayout">
                    <AppHeadingTwo className={styles.sectionTitle}>Actions</AppHeadingTwo>
                    <div className={styles.actionButtonsWrapper}>
                        <AppButton key="create-btn" onClick={createButton}><PlusSVG className={styles.buttonLogo} />Create Post</AppButton>

                        {deleteButton && (
                            <AppButton
                                key="delete-btn"
                                variant={isDeleting ? "secondary" : "primary"}
                                onClick={deleteButton}
                            >
                                {isDeleting ? (
                                    'Cancel Delete'
                                ) : (
                                    <>
                                        <TrashSVG className={styles.buttonLogo} />
                                        <span>Delete Posts</span>
                                    </>
                                )}
                            </AppButton>
                        )}

                        {isDeleting && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                key="confirm-delete-group"
                                className={styles.deleteWrapper}
                            >
                                <AppButton
                                    className={styles.deleteButton}
                                    variant="danger"
                                    disabled={deletingPostIds!.length === 0}
                                    showDisabledPopup
                                    onDisabledClick={() =>
                                        alert("Select at least one post before deleting.")
                                    }
                                    onClick={confirmDeleteButton}
                                >
                                    Confirm Delete ({deletingPostIds?.length})
                                </AppButton>
                            </motion.div>
                        )}
                    </div>
                </AnimatePresence>

            </div>


            <div className={styles.sortSection}>
                <label htmlFor="post-sort" className={styles.label}>Sort By</label>
                <select
                    id="post-sort"
                    className={styles.select}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="likes">Most Liked</option>
                    <option value="comments">Most Comments</option>
                    {isDashboard && <option value="status">Status</option>}
                </select>
            </div>
        </motion.nav>
    );
};

export default PostPanel;