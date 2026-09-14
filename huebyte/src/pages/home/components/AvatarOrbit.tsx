import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { HiUser } from "react-icons/hi";
import { Link } from "react-router-dom";
import avatar from "@/assets/avatar.png";
import { siteConfig, type HeroIcon } from "@/lib/site";
import "./AvatarOrbit.scss";

const icons: Record<HeroIcon, IconType> = {
  github: AiFillGithub,
  discord: FaDiscord,
  about: HiUser,
};

/** The avatar in a morphing blob, with link blobs orbiting it. */
export default function AvatarOrbit() {
  const links = siteConfig.heroLinks;

  return (
    <div className="orbit" style={{ "--count": links.length } as CSSProperties}>
      <div className="orbit__halo" aria-hidden="true" />

      <div className="orbit__avatar">
        <img
          src={avatar}
          alt="HueByte's avatar: a cat wizard in a green hat"
          width={600}
          height={600}
        />
      </div>

      <ul className="orbit__ring" aria-label="Links">
        {links.map((link, index) => {
          const Icon = icons[link.icon];
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
