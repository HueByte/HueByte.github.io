import { HiCalendar, HiClock, HiRefresh, HiTag } from "react-icons/hi";
import { formatArticleDate, type Article } from "@/lib/articles";

/** Date, reading time and tags. Used on the index cards and in the reader header. */
export default function ArticleMeta({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  const date = formatArticleDate(article.date);
  // Only worth showing when it says something the published date does not.
  const updated = article.updated === article.date ? "" : formatArticleDate(article.updated);

  return (
    <ul className={"meta" + (className ? " " + className : "")}>
      {date && (
        <li className="meta__item">
          <HiCalendar className="meta__icon" aria-hidden="true" />
          <time dateTime={article.date}>{date}</time>
        </li>
      )}
      {updated && (
        <li className="meta__item">
          <HiRefresh className="meta__icon" aria-hidden="true" />
          updated <time dateTime={article.updated}>{updated}</time>
        </li>
      )}
      <li className="meta__item">
        <HiClock className="meta__icon" aria-hidden="true" />
        {article.readingMinutes} min read
      </li>
      {article.tags.length > 0 && (
        <li className="meta__item">
          <HiTag className="meta__icon" aria-hidden="true" />
          {article.tags.map((tag) => (
            <span key={tag} className="meta__tag">
              {tag}
            </span>
          ))}
        </li>
      )}
    </ul>
  );
}
