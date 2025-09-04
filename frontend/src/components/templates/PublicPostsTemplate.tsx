import styles from '@/styles/publicPosts.module.css'


type Props = {
    cards: React.ReactNode[]
}

const PublicPostsTemplate: React.FC<Props> = ({ cards }) => {
    return (
        <div className={styles.cardsContainer} >
            {cards}
        </div>
    )
}

export default PublicPostsTemplate