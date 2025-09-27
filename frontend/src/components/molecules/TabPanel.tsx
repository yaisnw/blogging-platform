import AppButton from "../atoms/AppButton"
import styles from "@/styles/profilePage.module.css"

type Props = {
    setTabState: React.Dispatch<React.SetStateAction<'posts' | 'comments'>>,
    tabState: 'posts' | 'comments'
}

const TabPanel: React.FC<Props> = ({setTabState, tabState}) => {
    return (
        <div className={styles.tabPanel}>
            <AppButton className={`${styles.tabPanelButton} ${tabState === 'posts' && styles.activeTab}`} onClick={() => setTabState('posts')}>Posts</AppButton>
            <AppButton className={`${styles.tabPanelButton} ${tabState === 'comments' && styles.activeTab}`} onClick={() => setTabState('comments')}>Comments</AppButton>
        </div>
    )
}

export default TabPanel