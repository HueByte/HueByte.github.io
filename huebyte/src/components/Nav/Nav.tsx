import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { mulberry32 } from "@/lib/random";
import { siteConfig } from "@/lib/site";
import "./Nav.scss";

const SPARK_COUNT = 16;
const SPARK_COLORS = ["#ffe9c4", "#ffe9c4", "#ffe9c4", "#fff6e6", "#c62368", "#00fa9a"];

interface Spark {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

/** Twinkling dots scattered inside the corner blob. Deterministic, so it never reshuffles. */
function makeSparks(): Spark[] {
  const rand = mulberry32(77);
  return Array.from({ length: SPARK_COUNT }, () => ({
    x: 4 + rand() * 70,
    y: 4 + rand() * 82,
    size: 1.5 + rand() * rand() * 2.5,
    color: SPARK_COLORS[Math.floor(rand() * SPARK_COLORS.length)] ?? "#ffe9c4",
    delay: -rand() * 6,
    duration: 2.4 + rand() * 3.2,
  }));
}

/** Corner blob with the menu toggle and a slide-in side menu, in the spirit of the Mirage site. */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const sparks = useMemo(() => makeSparks(), []);

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
        <div className="nav__blob">
          <div className="nav__sparks" aria-hidden="true">
            {sparks.map((spark, i) => (
              <span
                key={i}
                className="nav__spark"
                style={
                  {
                    left: spark.x + "%",
                    top: spark.y + "%",
                    "--size": spark.size + "px",
                    "--color": spark.color,
                    "--delay": spark.delay + "s",
                    "--duration": spark.duration + "s",
                  } as CSSProperties
                }
              />
            ))}
          </div>
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
