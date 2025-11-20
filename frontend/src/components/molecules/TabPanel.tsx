// TabPanel.tsx
import AppButton from "../atoms/AppButton";
import styles from "@/styles/profilePage.module.css";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks";
import type { RootState } from "@/store";
import { setSearchTab, setProfileTab } from "@/slices/uiSlice";

type Props = {
    mode: 'profile' | 'search';
};

const TabPanel: React.FC<Props> = ({ mode }) => {
    const dispatch = useAppDispatch();
    const { searchTab, profileTab } = useSelector((state: RootState) => state.ui);

    return (
        <div className={styles.tabPanel} role="tablist" aria-label="Profile tabs">
            {
                mode === 'search' && (
                    <AppButton
                        className={`${styles.tabPanelButton} ${searchTab === 'posts' ? styles.activeTab : ''}`}
                        onClick={() => dispatch(setSearchTab('posts'))}
                        role="tab"
                        aria-selected={searchTab === 'posts'}
                    >
                        Posts
                    </AppButton>
                )
            }
            {
                mode === 'profile' && (
                    <AppButton
                        className={`${styles.tabPanelButton} ${profileTab === 'posts' ? styles.activeTab : ''}`}
                        onClick={() => dispatch(setProfileTab('posts'))}
                        role="tab"
                        aria-selected={profileTab === 'posts'}
                    >
                        Posts
                    </AppButton>
                )
            }
            {mode === 'search' && (
                <AppButton
                    className={`${styles.tabPanelButton} ${searchTab === 'users' ? styles.activeTab : ''}`}
                    onClick={() => dispatch(setSearchTab('users'))}
                    role="tab"
                    aria-selected={searchTab === 'users'}
                >
                    Users
                </AppButton>
            )}

            {mode === 'profile' && (
                <AppButton
                    className={`${styles.tabPanelButton} ${profileTab === 'comments' ? styles.activeTab : ''}`}
                    onClick={() => dispatch(setProfileTab('comments'))}
                    role="tab"
                    aria-selected={profileTab === 'comments'}
                >
                    Comments
                </AppButton>
            )}
        </div>
    );
};

export default TabPanel;
