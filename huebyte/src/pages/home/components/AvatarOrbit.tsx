import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import Avatar from "@/components/Avatar/Avatar";
import { siteIcons } from "@/lib/icons";
import { siteConfig } from "@/lib/site";
import "./AvatarOrbit.scss";

/** The avatar in a morphing blob, with link blobs orbiting it. */
export default function AvatarOrbit() {
  const links = siteConfig.heroLinks;

  return (
    <div className="orbit" style={{ "--count": links.length } as CSSProperties}>
      <div className="orbit__halo" aria-hidden="true" />

      <div className="orbit__avatar">
        <Avatar size={260} alt="HueByte's avatar: a cat wizard in a green hat" />
      </div>

      <ul className="orbit__ring" aria-label="Links">
        {links.map((link, index) => {
          const Icon = siteIcons[link.icon];
          return (
            <li key={link.id} className="orbit__slot" style={{ "--i": index } as CSSProperties}>
              {link.external ? (
                <a
                  className="orbit__link"
                  href={link.href}
                  title={link.label}
                  aria-label={link.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon aria-hidden="true" />
                </a>
              ) : (
                <Link
                  className="orbit__link"
                  to={link.href}
                  title={link.label}
                  aria-label={link.label}
                >
                  <Icon aria-hidden="true" />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
