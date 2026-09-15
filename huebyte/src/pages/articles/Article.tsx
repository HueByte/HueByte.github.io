import Markdown, { type Components } from "react-markdown";
import { Link, useParams } from "react-router-dom";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { getArticle } from "@/lib/articles";
import ArticleMeta from "./ArticleMeta";
import CodeWindow from "./CodeWindow";
import "./Articles.scss";

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeHighlight];

// Links written in markdown: off-site ones open in a new tab, on-site ones stay in the router
// instead of reloading the whole app.
const components: Components = {
  // Fenced code is framed as a small window rather than a bare panel.
  pre: CodeWindow,
  a({ href, title, children }) {
    if (href?.startsWith("/")) {
      return (
        <Link to={href} title={title}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} title={title} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },
};

/** One article, rendered from its markdown file. Same blob background as the index. */
export default function Article() {
  const { slug } = useParams();
  const article = getArticle(slug);

  if (!article) {
    return (
      <div className="blob-page article">
        <div className="blob-page__content">
          <h1 className="blob-page__title">No such article</h1>
          <p className="blob-page__lede">
            Nothing is published at that address. It may have been renamed, or never existed.
          </p>
          <Link to="/articles" className="blob-page__back">
            <span aria-hidden="true">&larr;</span> all articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="blob-page article">
      <div className="blob-page__content">
        <header className="article__head">
          <Link to="/articles" className="blob-page__eyebrow">
            <span aria-hidden="true">&larr;</span> Articles
          </Link>
          <h1 className="blob-page__title">{article.title}</h1>
          <ArticleMeta article={article} className="article__meta" />
        </header>

        <div className="md">
          <Markdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            components={components}
          >
            {article.body}
          </Markdown>
        </div>

        <Link to="/articles" className="blob-page__back">
          <span aria-hidden="true">&larr;</span> all articles
        </Link>
      </div>
    </article>
  );
}
