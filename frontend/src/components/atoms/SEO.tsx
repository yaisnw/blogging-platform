import { Helmet } from "@dr.pogodin/react-helmet";

type SEOProps = {
    title: string,
    description: string,
    author?: string
}

const SEO: React.FC<SEOProps> = ({
  title,
  description, 
  author = "MyBlog Team",
}) => {
  const safeDescription = description && description.length > 10 
    ? description 
    : "Read insightful posts and professional blogging content on MyBlog.";

  const pageTitle = title ? `${title} | MyBlog` : "MyBlog";

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={safeDescription} />
      <meta name="author" content={author} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:type" content="article" />
    </Helmet>
  );
}

export default SEO;
