import { useEffect, useState } from "react";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { siteConfig } from "@/lib/site";
import "./Nav.scss";

/** Slide-in side menu, in the spirit of the Mirage site's menu. */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

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
      <button
        type="button"
        className={"nav__toggle" + (open ? " nav__toggle--hidden" : "")}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="site-menu"
      >
        <HiMenu aria-hidden="true" />
      </button>

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
                end
                className={({ isActive }) => "nav__item" + (isActive ? " nav__item--active" : "")}
                onClick={close}
              >
                {link.label}
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
                {link.label}
              </a>
            ),
          )}
        </nav>
      </div>
    </>
  );
}
