import styles from "../../styles/myBlogs.module.css"

type MyBlogsProps = {
  panel: React.ReactNode;
  cards: React.ReactNode[]
};

const MyBlogsTemplate: React.FC<MyBlogsProps>= ({panel, cards}) => {
    return (
        <div className={styles.myBlogsFlex}>
            <section>
                {panel}
            </section>
            <section className={styles.blogCardsBox}>
                {cards}
            </section>
        </div>
    )
}
export default MyBlogsTemplate;