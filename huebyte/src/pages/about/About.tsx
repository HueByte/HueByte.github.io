import avatar from "@/assets/avatar.png";
import { siteConfig } from "@/lib/site";
import "./About.scss";

// Placeholder copy until the real draft lands. Only the layout matters for now.
const sections = [
  {
    id: "who",
    title: "Who I am",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ],
  },
  {
    id: "what",
    title: "What I do",
    paragraphs: [
      "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.",
      "Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.",
    ],
  },
  {
    id: "else",
    title: "Everything else",
    paragraphs: [
      "Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.",
    ],
  },
];

// The background is the layout's BlobBackdrop, which spreads out of the menu corner on this route.
export default function About() {
  return (
    <article className="about">
      <div className="about__content">
        <header className="about__hero">
          <div className="about__avatar">
            <img src={avatar} alt="" width={160} height={160} />
          </div>
          <div className="about__intro">
            <p className="about__eyebrow">About me</p>
            <h1 className="about__name">{siteConfig.name}</h1>
            <p className="about__tagline">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
            </p>
          </div>
        </header>

        <div className="about__body">
          {sections.map((section) => (
            <section key={section.id} className="about__section" aria-labelledby={section.id}>
              <h2 id={section.id} className="about__heading">
                {section.title}
              </h2>
              {section.paragraphs.map((text, i) => (
                <p key={i} className="about__text">
                  {text}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
