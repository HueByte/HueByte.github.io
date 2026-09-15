// Site-wide constants. Keep values here rather than scattered through components.
// Every "icon" is a key of siteIcons in @/lib/icons.
export const siteConfig = {
  name: "HueByte",
  githubUser: "HueByte",
  // Side menu entries. "route" is an in-app link, "page" a full navigation on this domain.
  navLinks: [
    { label: "Home", href: "/", kind: "route", icon: "home" },
    { label: "About me", href: "/about", kind: "route", icon: "about" },
    { label: "Articles", href: "/articles", kind: "route", icon: "articles" },
    { label: "GitHub", href: "https://github.com/HueByte", kind: "external", icon: "github" },
    { label: "Mirage (2022-2026)", href: "/legacy/v_mirage/", kind: "page", icon: "legacy" },
  ],
  // Blobs orbiting the avatar on the landing page, in orbit order.
  heroLinks: [
    {
      id: "discord",
      label: "Discord",
      href: "https://discordapp.com/users/215556401467097088",
      icon: "discord",
      external: true,
    },
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/HueByte",
      icon: "github",
      external: true,
    },
    {
      id: "articles",
      label: "Articles",
      href: "/articles",
      icon: "articles",
      external: false,
    },
    {
      id: "about",
      label: "About me",
      href: "/about",
      icon: "about",
      external: false,
    },
  ],
  // Routes where the menu's corner blob spreads out to become the page background. A path
  // matches its own entry and anything below it, so /articles/<slug> counts as well.
  blobPages: ["/about", "/articles"],
  // Previous versions of the site. Each is a standalone app under ../Legacy/v_<Name>,
  // mounted by scripts/build-site.mjs. The URL must match that app's Vite base.
  legacySites: [{ id: "mirage", label: "Mirage (2022-2026)", url: "/legacy/v_mirage/" }],
} as const;

export type NavLink = (typeof siteConfig.navLinks)[number];
export type HeroLink = (typeof siteConfig.heroLinks)[number];

/** True when the menu's corner blob is the page background on this route. */
export function isBlobPage(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  return (siteConfig.blobPages as readonly string[]).some(
    (base) => path === base || path.startsWith(base + "/"),
  );
}
