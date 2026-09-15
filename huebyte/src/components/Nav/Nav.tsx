import { useEffect, useState } from "react";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import { NavLink, useLocation } from "react-router-dom";
import Sparks from "@/components/Sparks/Sparks";
import { siteIcons } from "@/lib/icons";
import { isBlobPage, siteConfig, type NavLink as NavLinkItem } from "@/lib/site";
import "./Nav.scss";

// Keeps the sparks away from the blob's curved edge.
const SPARK_AREA = { x: [4, 74] as [number, number], y: [4, 86] as [number, number] };

/** Icon plus label, the shared inside of every menu entry. */
function Entry({ link }: { link: NavLinkItem }) {
  const Icon = siteIcons[link.icon];
  return (
    <>
      <Icon className="nav__icon" aria-hidden="true" />
      <span className="nav__label">{link.label}</span>
    </>
  );
}

/** Corner blob with the menu toggle and a slide-in side menu, in the spirit of the Mirage site. */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  // On pages where the blob has spread out (see BlobBackdrop) the corner copy drops its fill,
  // so the toggle and sparks sit directly on the page-wide version.
  const merged = isBlobPage(useLocation().pathname);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className={"nav__corner" + (open ? " nav__corner--hidden" : "")}>
        <div className={"nav__blob" + (merged ? " nav__blob--merged" : "")}>
          <Sparks count={16} seed={77} area={SPARK_AREA} />
          <button
            type="button"
            className="nav__toggle"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
          >
            <HiMenu aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <button type="button" className="nav__backdrop" onClick={close} aria-label="Close menu" />
      )}

      <div id="site-menu" className={"nav" + (open ? " nav--open" : "")} inert={!open}>
        <button type="button" className="nav__close" onClick={close} aria-label="Close menu">
          <HiOutlineX aria-hidden="true" />
        </button>

        <nav className="nav__items" aria-label="Site">
          {siteConfig.navLinks.map((link) =>
            link.kind === "route" ? (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) => "nav__item" + (isActive ? " nav__item--active" : "")}
                onClick={close}
              >
                <Entry link={link} />
              </NavLink>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="nav__item"
                onClick={close}
                target={link.kind === "external" ? "_blank" : undefined}
                rel={link.kind === "external" ? "noreferrer" : undefined}
              >
                <Entry link={link} />
              </a>
            ),
          )}
        </nav>
      </div>
    </>
  );
}
