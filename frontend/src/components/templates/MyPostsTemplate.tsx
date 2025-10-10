import styles from "../../styles/myPosts.module.css";

type MyPostsProps = {
    panel: React.ReactNode;
    cards: React.ReactNode[];
};

const MyPostsTemplate: React.FC<MyPostsProps> = ({ panel, cards }) => {
    return (
        <main className={styles.myPostsFlex}>
            <aside>{panel}</aside>
            <section className={styles.postCardsBox}>{cards}</section>
        </main>
    );
};

export default MyPostsTemplate;
