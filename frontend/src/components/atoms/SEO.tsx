import { Helmet } from "@dr.pogodin/react-helmet";

type SEOProps = {
    title: string,
    description: string,
    author?: string
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = "Read insightful posts on MyBlog.",
  author = "MyBlog Team",
}) => {
  const pageTitle = title ? `${title} | MyBlog` : "MyBlog";

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
    </Helmet>
  );
}

export default SEO;
