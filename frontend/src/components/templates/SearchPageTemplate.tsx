type Props = {
  tabPanel: React.ReactNode;
  tabContent: React.ReactNode;
};

const SearchTemplate: React.FC<Props> = ({ tabPanel, tabContent }) => {
  return (
    <main>
      <nav>{tabPanel}</nav>
      <section>{tabContent}</section>
    </main>
  );
};

export default SearchTemplate;
