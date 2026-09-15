import { HiNewspaper } from "react-icons/hi";
import { Link } from "react-router-dom";
import { articles } from "@/lib/articles";
import ArticleMeta from "./ArticleMeta";
import "./Articles.scss";

// The background is the layout's BlobBackdrop, which spreads out of the menu corner on this route.
export default function Articles() {
  return (
    <div className="blob-page articles">
      <div className="blob-page__content">
        <header className="articles__head">
          <p className="blob-page__eyebrow">
            <HiNewspaper aria-hidden="true" /> Writing
          </p>
          <h1 className="blob-page__title">Articles</h1>
          <p className="blob-page__lede">
            Notes on things I build and things I read: engineering, agents, and the occasional
            unhinged experiment. Written whenever I have something worth saying.
          </p>
        </header>

        {articles.length === 0 ? (
          <p className="articles__empty">
            Nothing published yet. The first one is somewhere between a draft and an intention.
          </p>
        ) : (
          <ul className="articles__list">
            {articles.map((article) => (
              <li key={article.slug} className="articles__card">
                <ArticleMeta article={article} />
                <h2 className="articles__card-title">
                  <Link className="articles__link" to={"/articles/" + article.slug}>
                    {article.title}
                  </Link>
                </h2>
                {article.summary && <p className="articles__summary">{article.summary}</p>}
              </li>
            ))}
          </ul>
        )}

        <Link to="/" className="blob-page__back">
          <span aria-hidden="true">&larr;</span> back
        </Link>
      </div>
    </div>
  );
}
