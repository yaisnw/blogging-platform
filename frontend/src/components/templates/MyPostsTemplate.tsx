import styles from "../../styles/myPosts.module.css"

type MyPostsProps = {
  panel: React.ReactNode;
  cards: React.ReactNode[]
};

const MyPostsTemplate: React.FC<MyPostsProps>= ({panel, cards}) => {
    return (
        <div className={styles.myPostsFlex}>
            <section>
                {panel}
            </section>
            <section className={styles.postCardsBox}>
                {cards}
            </section>
        </div>
    )
}
export default MyPostsTemplate;