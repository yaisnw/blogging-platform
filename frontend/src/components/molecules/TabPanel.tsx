import AppButton from "../atoms/AppButton"
import styles from "@/styles/profilePage.module.css"
import { useSelector } from "react-redux"
import { useAppDispatch } from "@/hooks"
import type { RootState } from "@/store"
import { setTabState } from "@/slices/uiSlice"

type Props = {
    mode: 'profile' | 'search'
}

const TabPanel: React.FC<Props> = ({ mode }) => {
    const dispatch = useAppDispatch();
    const tabState = useSelector((state: RootState) => state.ui.tabState);
    
    return (
        <div className={styles.tabPanel}>
            <AppButton
                className={`${styles.tabPanelButton} ${tabState === 'posts' && styles.activeTab}`}
                onClick={() => dispatch(setTabState('posts'))}
            >
                Posts
            </AppButton>

            {mode === 'search' && (
                <AppButton
                    className={`${styles.tabPanelButton} ${tabState === 'users' && styles.activeTab}`}
                    onClick={() => dispatch(setTabState('users'))}
                >
                    Users
                </AppButton>
            )}

            {mode === 'profile' && (
                <AppButton
                    className={`${styles.tabPanelButton} ${tabState === 'comments' && styles.activeTab}`}
                    onClick={() => dispatch(setTabState('comments'))}
                >
                    Comments
                </AppButton>
            )}
        </div>
    )
}

export default TabPanel
