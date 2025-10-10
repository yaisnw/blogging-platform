import styles from "@/styles/publicPosts.module.css";

type Props = {
    cards: React.ReactNode[];
};

const PublicPostsTemplate: React.FC<Props> = ({ cards }) => {
    return (
        <main className={styles.cardsContainer}>
            {cards}
        </main>
    );
};

export default PublicPostsTemplate;
