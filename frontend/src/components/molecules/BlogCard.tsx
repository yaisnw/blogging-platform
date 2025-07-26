import AppHeader from "../atoms/AppHeader";
import AppImage from "../atoms/AppImage";
import AppParagraph from "../atoms/AppParagraph";
import styles from '../../styles/blogCard.module.css'

type BlogCardProps = {
    title: string,
    likeCount: number,
    commentCount: number
}

const BlogCard: React.FC<BlogCardProps> = ({ title, likeCount, commentCount, ...props}) => {
    return (
        <div className={styles.blogCard} {...props}>
            <AppHeader className={styles.title}>{title}</AppHeader>
            <section className={styles.interactionBox}>
                <div className={styles.interactionContent}>
                    <AppParagraph>{likeCount}</AppParagraph>
                    <AppImage className={styles.blogCardImage} src="/heart.svg" alt="Heart" />
                </div>
                <div className={styles.interactionContent}>
                    <AppParagraph>{commentCount}</AppParagraph>
                    <AppImage className={styles.blogCardImage} src="/comment.svg" alt='text box' />
                </div>
            </section>
        </div>
    )
}

export default BlogCard;