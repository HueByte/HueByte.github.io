import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { AiFillGithub } from "react-icons/ai";
import { BiMailSend } from "react-icons/bi";
import { FaDiscord } from "react-icons/fa";
import { RiHistoryLine } from "react-icons/ri";
import avatar from "@/assets/avatar.png";
import { siteConfig, type HeroIcon } from "@/lib/site";
import "./AvatarOrbit.scss";

const icons: Record<HeroIcon, IconType> = {
  github: AiFillGithub,
  discord: FaDiscord,
  mail: BiMailSend,
  mirage: RiHistoryLine,
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
              <a
                className="orbit__link"
                href={link.href}
                title={link.label}
                aria-label={link.label}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                <Icon aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
