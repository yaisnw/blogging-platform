import styles from "../../styles/dashboardPage.module.css";

type DashBoardTemplateProps = {
    panel: React.ReactNode;
    cards: React.ReactNode[];
};

const DashboardTemplate: React.FC<DashBoardTemplateProps> = ({ panel, cards }) => {
    return (
        <main className={styles.dashboardFlex}>
            <aside>{panel}</aside>
            <section className={styles.postCardsBox}>{cards}</section>
        </main>
    );
};

export default DashboardTemplate;
