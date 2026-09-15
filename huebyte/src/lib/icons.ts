import type { IconType } from "react-icons";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { HiArchive, HiHome, HiNewspaper, HiUser } from "react-icons/hi";

/**
 * One icon per named destination, shared by the side menu and the orbiting hero blobs so a
 * link looks the same wherever it appears. Keys are referenced by name from `siteConfig`.
 */
export const siteIcons = {
  home: HiHome,
  about: HiUser,
  articles: HiNewspaper,
  github: AiFillGithub,
  discord: FaDiscord,
  legacy: HiArchive,
} satisfies Record<string, IconType>;

export type SiteIcon = keyof typeof siteIcons;
