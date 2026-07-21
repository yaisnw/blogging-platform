import AppButton from "../atoms/AppButton"
import styles from '../../styles/postPanel.module.css'
import UIstyles from '@/styles/ui.module.css'
import { AnimatePresence, motion } from "motion/react";
import AppHeadingTwo from "../atoms/AppHeadingTwo";
import { PlusSVG, TrashSVG } from "../atoms/Icons";
type postPanelProps = {
    createButton: () => void;
    deleteButton?: () => void;
    confirmDeleteButton?: () => void;
    isDeleting?: boolean;
    deletingPostIds?: number[];
    onSortChange: (val: string) => void;
    sort?: string;
    isDashboard?: boolean;
    showMine?: boolean;
    onFilterChange?: (mine: boolean) => void;
}

const PostPanel: React.FC<postPanelProps> = ({
    createButton,
    deleteButton,
    confirmDeleteButton,
    isDeleting,
    deletingPostIds,
    onSortChange,
    sort = 'newest',
    isDashboard,
    showMine,
    onFilterChange
}) => {
    // One hint slot, three states. On "All posts" the delete button is absent
    // because you can only delete your own posts — say so rather than leaving
    // its absence unexplained.
    const canDelete = Boolean(deleteButton);
    const hintText = isDeleting
        ? (deletingPostIds?.length
            ? `${deletingPostIds.length} post${deletingPostIds.length === 1 ? '' : 's'} selected. This can't be undone.`
            : 'Select the posts you want to delete.')
        : (onFilterChange && !canDelete
            ? 'Switch to "My posts" to edit or delete your own posts.'
            : '');

    return (
        <motion.nav
            initial={{ opacity: 0.6, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={styles.panel}
            aria-label="Post actions">

            <div className={styles.actionSection}>
                <AppHeadingTwo className={styles.sectionTitle}>Actions</AppHeadingTwo>
                <div className={styles.actionButtonsWrapper}>
                    <AppButton onClick={createButton}><PlusSVG className={UIstyles.buttonSVG} />Create Post</AppButton>

                    {deleteButton && (
                        <AppButton
                            variant={isDeleting ? "secondary" : "primary"}
                            onClick={deleteButton}
                        >
                            {isDeleting ? (
                                'Cancel Delete'
                            ) : (
                                <>
                                    <TrashSVG className={UIstyles.buttonSVG} />
                                    <span>Delete Posts</span>
                                </>
                            )}
                        </AppButton>
                    )}

                    {/* Only this block actually mounts/unmounts, so AnimatePresence
                        wraps just it — each direct child needs a unique key. */}
                    <AnimatePresence mode="popLayout">
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
                    </AnimatePresence>
                </div>

                {/* Always rendered so showing/hiding the hint doesn't reflow the
                    page (layout shift); only its visibility changes. Explains the
                    missing delete button on the All posts view. */}
                <p
                    className={`${styles.deleteHint} ${hintText ? '' : styles.deleteHintHidden}`}
                    role="status"
                >
                    <span>{hintText}</span>
                </p>
            </div>


            <div className={styles.sortSectionWrapper}>
                {onFilterChange && (
                <div className={styles.sortSection}>
                    <span className={styles.label}>Show</span>
                    <div className={styles.filterGroup} role="group" aria-label="Filter posts">
                        <button
                            type="button"
                            className={`${styles.filterButton} ${!showMine ? styles.filterButtonActive : ''}`}
                            aria-pressed={!showMine}
                            onClick={() => onFilterChange(false)}
                        >
                            All posts
                        </button>
                        <button
                            type="button"
                            className={`${styles.filterButton} ${showMine ? styles.filterButtonActive : ''}`}
                            aria-pressed={showMine}
                            onClick={() => onFilterChange(true)}
                        >
                            My posts
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.sortSection}>
                <label htmlFor="post-sort" className={styles.label}>Sort By</label>
                <select
                    id="post-sort"
                    className={styles.select}
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="likes">Most Liked</option>
                    <option value="comments">Most Comments</option>
                    {isDashboard && <option value="status">Status</option>}
                </select>
            </div>
            </div>
        </motion.nav>
    );
};

export default PostPanel;