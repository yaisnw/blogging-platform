import styles from "@/styles/publicPosts.module.css";

type Props = {
    panel: React.ReactNode;
    cards: React.ReactNode;
};

const PublicPostsTemplate: React.FC<Props> = ({ panel, cards }) => {
    return (
        <main className={styles.cardsContainer}>
            {panel}
            {cards}
        </main>
    );
};

export default PublicPostsTemplate;
