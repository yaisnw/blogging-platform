import AppButton from "../atoms/AppButton"
import styles from '../../styles/myBlogs.module.css'

type blogPanelProps = {
    createButton: ()=> void;
    editButton: ()=> void;
    deleteButton: ()=> void;
}

const BlogPanel: React.FC<blogPanelProps> = ({ createButton, editButton, deleteButton }) => {
    return (
        <div className={styles.panel}>
            <AppButton onClick={createButton} >Create a Post</AppButton>
            <AppButton onClick={editButton}>Edit Post</AppButton>
            <AppButton onClick={deleteButton}>Delete Post</AppButton>
        </div>
    )
}

export default BlogPanel;