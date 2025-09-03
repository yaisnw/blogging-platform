import AppButton from "../atoms/AppButton"
import styles from '../../styles/myPosts.module.css'

type postPanelProps = {
    createButton: ()=> void;
    deleteButton: ()=> void;
    confirmDeleteButton: ()=> void;
    isDeleting: boolean,
}

const PostPanel: React.FC<postPanelProps> = ({ createButton, deleteButton, confirmDeleteButton, isDeleting }) => {
    return (
        <div className={styles.panel}>
            <AppButton onClick={createButton} >Create a Post</AppButton>
            <AppButton onClick={deleteButton}>{isDeleting ? 'Cancel Delete' : 'Delete Posts'}</AppButton>
            {isDeleting && <AppButton onClick={confirmDeleteButton}>Delete Selected</AppButton>}
        </div>
    )
}

export default PostPanel;