import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import avatar from "@/assets/avatar.png";
import { siteConfig } from "@/lib/site";
import "./About.scss";

// Projects named in the copy below. Kept here rather than in site.ts: they are page copy,
// not site-wide config.
const projects = {
  auriondocs: "https://github.com/AurionDocs",
  echohub: "https://github.com/RedWizardsLab/EchoHub",
  whodat: "https://github.com/HueByte/whodat",
};

function Project({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="about__link" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

// Placeholder copy until the real draft lands. Only the layout matters for now.
const sections: { id: string; title: string; paragraphs: ReactNode[] }[] = [
  {
    id: "who",
    title: "Who I am",
    paragraphs: [
      "I'm Hue, a Polish software engineer and independent builder. I've been making things with code for a longer while, and at some point it turns into a company, a handful of open-source projects, and a running list of ideas I'll probably never fully clear. I'm fine with that; the list is half the fun.",
      "I think in systems. Not just software systems, but the shape of things: how pieces depend on each other, what emerges when you connect them, what breaks when you scale them. That habit spills into everything, from how I design infrastructure to how I read philosophy. Engineering, cognition, and the question of what intelligence actually is all feel like one subject to me, just approached from different doors.",
    ],
  },
  {
    id: "what",
    title: "What I do",
    paragraphs: [
      <>
        Right now most of my time goes into <Project href={projects.auriondocs}>AurionDocs</Project>
        , an AI-driven documentation engine for engineering teams that runs inside their own
        infrastructure. It's the kind of problem I like: agents, retrieval, distributed systems, and
        the very human question of how knowledge about a codebase stays alive instead of quietly
        rotting. I build it mostly in .NET and Rust, with React on top and Kubernetes underneath.
      </>,
      <>
        Around that, I keep a few side projects alive under the HueByte name:{" "}
        <Project href={projects.echohub}>EchoHub</Project>, a self-hosted chat server;{" "}
        <Project href={projects.whodat}>whodat</Project>, a small CLI for keeping track of who you
        are across a hundred terminals; and various experiments in agent architectures and personal
        AI tooling. The thread connecting them is a belief that AI should expand what people can
        think and do, not replace them or farm them.
      </>,
    ],
  },
  {
    id: "else",
    title: "Everything else",
    paragraphs: [
      "Away from the keyboard I play guitar (classical training, now mostly fingerstyle) and read far too much science: physics, cognition, anything that explains the silly questions I have. Music, science and programming are the three things I never get tired of, usually in some combination with my insomnia.",
      "I also have a real weakness for silly and unhinged things, cursed experiments, projects just to mess around with friends. Longer term I'd like a house in a forest somewhere, a workshop for making pipes and forging knives (hobbies where you can't ctrl-z), a lighter work week, and enough space to keep building things because I want to, not because I have to.",
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
            <p className="about__tagline">Software Engineer · Wizard of arcane nonsense</p>
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

        <Link to="/" className="about__back">
          <span aria-hidden="true">&larr;</span> back
        </Link>
      </div>
    </article>
  );
}
