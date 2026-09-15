import { useEffect, useRef, useState, type ReactNode } from "react";
import { HiCheck, HiOutlineClipboardCopy } from "react-icons/hi";
import type { Element, ElementContent } from "hast";

// Short badge labels for the fence languages likely to show up here. Anything missing falls
// back to the token as written, uppercased, so an unlisted language still labels itself.
const LANGUAGE_BADGES: Record<string, string> = {
  bash: "SH",
  csharp: "C#",
  cs: "C#",
  dockerfile: "DOCKER",
  docker: "DOCKER",
  javascript: "JS",
  markdown: "MD",
  python: "PY",
  rust: "RS",
  shell: "SH",
  typescript: "TS",
  yml: "YAML",
};

const TITLE_IN_META = /title=(?:"([^"]*)"|'([^']*)')/;
const COPIED_MS = 1600;

function firstElement(node: Element | undefined): Element | undefined {
  return node?.children.find((child): child is Element => child.type === "element");
}

/** The fence language, from the `language-*` class rehype puts on the `code` element. */
function languageOf(code: Element | undefined): string {
  const names = code?.properties.className;
  if (!Array.isArray(names)) return "";
  for (const name of names) {
    if (typeof name === "string" && name.startsWith("language-")) return name.slice(9);
  }
  return "";
}

/** The file name, from the rest of the fence line: a fence of `ts App.tsx`, or title="App.tsx". */
function titleOf(code: Element | undefined): string {
  const data = code?.data;
  const meta = data && "meta" in data ? data.meta : undefined;
  if (typeof meta !== "string") return "";
  const quoted = TITLE_IN_META.exec(meta);
  return (quoted?.[1] ?? quoted?.[2] ?? meta).trim();
}

/** The code as plain text, walking past the spans the highlighter wrapped it in. */
function textOf(nodes: ElementContent[] | undefined): string {
  if (!nodes) return "";
  return nodes
    .map((node) => {
      if (node.type === "text") return node.value;
      if (node.type === "element") return textOf(node.children);
      return "";
    })
    .join("");
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      // Denied permission, an insecure origin, or no clipboard at all. Nothing useful to say.
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  }

  return (
    <button
      type="button"
      className={"code-window__copy" + (copied ? " code-window__copy--done" : "")}
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? <HiCheck aria-hidden="true" /> : <HiOutlineClipboardCopy aria-hidden="true" />}
    </button>
  );
}

/**
 * A fenced code block. The header is only what is worth having on every block: the file name
 * when the fence names one, the language, and a copy button. Replaces `pre` in the markdown
 * renderer, so `node` is the `pre` element and its only child is the highlighted `code`.
 */
export default function CodeWindow({ node, children }: { node?: Element; children?: ReactNode }) {
  const code = firstElement(node);
  const language = languageOf(code);
  const title = titleOf(code);
  const badge = language ? (LANGUAGE_BADGES[language] ?? language.toUpperCase()) : "";

  return (
    <figure className="code-window">
      <figcaption className="code-window__bar">
        {title && <span className="code-window__name">{title}</span>}
        <span className="code-window__tools">
          {badge && <span className="code-window__lang">{badge}</span>}
          <CopyButton text={textOf(code?.children)} />
        </span>
      </figcaption>
      <pre>{children}</pre>
    </figure>
  );
}
