import{c as e,d as t,i as n,n as r,s as i}from"./index-CxsHM_Wa.js";var a=`---
title: Title of the article
date: 2026-01-01
updated: 2026-01-02
summary: One or two sentences for the list page. Optional; the first paragraph is used instead.
tags: [tag, another-tag]
---

The body is plain GitHub-flavoured markdown: headings, lists, tables, task lists, images,
\`inline code\` and fenced code blocks with syntax highlighting.

A fenced block gets a language badge and a copy button. Name the language after the backticks
for the badge, and add a file name after it if the block is worth naming: \`\`\`ts, or
\`\`\`ts App.tsx, or \`\`\`ts title="App.tsx" if the name has spaces in it. The file name is optional
and most blocks do not need one.

## A heading

Copy this file to \`articles/<name>.md\` and start writing. The file name becomes the URL, with
no date in it. The leading underscore in this file name keeps it out of the article list, so it
is also how you park a draft.

\`date\` is the only required key: the list is ordered by it, newest first. \`updated\` is optional,
shows on the article as "updated ...", and deliberately does not change the order. Drop it until
you actually revise something.

No em dashes and no en dashes. Use a comma, a colon, a semicolon, or two sentences instead.
\`npm run check\` fails and names the line if one slips in.
`,o=`---
title: How this section works
date: 2026-09-15
summary: A placeholder first post, and a short note on how articles get published here.
tags: [meta]
---

So basically I never done blogs before, but I want to have a place to write down thoughts and ideas.

## Publishing

Articles are markdown files in \`articles/\` in this repo. Each one starts with a small block of
frontmatter:

\`\`\`yaml
---
title: How this section works
date: 2026-09-15
updated: 2026-09-16
summary: A short blurb for the list.
tags: [meta]
---
\`\`\`

\`date\` is required and orders the list. \`updated\` is optional and only shows on the article,
so correcting an old post does not shove it back to the top.

Vite reads the folder at build time, so publishing is a push to \`master\`, and the deploy
workflow does the rest. Nothing is fetched at runtime, so there is no API to rate-limit and no
spinner before the text appears.

## Conventions

The file name becomes the URL and carries no date: \`hello-world.md\` is served at
\`/articles/hello-world\`. A file name starting with an underscore stays in the repo and off the
site, which is how drafts work.

The body is GitHub-flavoured markdown: headings, lists, tables, task lists, images, quotes,
\`inline code\` and fenced code blocks with syntax highlighting.

## What it looks like

Everything below is here to show the styling, not to say anything.

Body text sits at a comfortable measure with **bold**, *italic*, \`inline code\` and
[links](/about) picked out in the accent colour. Lists come in both flavours:

- a bullet
- another bullet
- one more, for the shape of it

1. first
2. second
3. third

> A quote is set in italics behind a gold rule, for when someone else said it better.

Code blocks are highlighted in the same palette as the rest of the site:

\`\`\`ts readingMinutes.ts
export function readingMinutes(markdown: string): number {
  const words = markdown.split(/\\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
\`\`\`

Tables scroll sideways rather than widening the page:

| Element  | Where it comes from | Styled in      |
| -------- | ------------------- | -------------- |
| Headings | markdown            | \`Articles.scss\` |
| Code     | rehype-highlight    | \`.hljs-*\`      |
| Tags     | frontmatter         | \`.meta__tag\`   |

Task lists work too:

- [x] render markdown
- [x] highlight code
- [ ] write something worth reading

---

And a rule closes it off.
`,s=/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;function c(e){let t=e.trim(),n=t[0];return(n===`"`||n===`'`)&&t.length>1&&t.endsWith(n)?t.slice(1,-1):t}function l(e){return e.slice(1,-1).split(`,`).map(c).filter(e=>e.length>0)}function u(e){let t=e.replace(/^﻿/,``),n=s.exec(t);if(!n?.[1])return{data:{},body:t.trimStart()};let r={},i=null;for(let e of n[1].split(/\r?\n/)){if(!e.trim()||e.trimStart().startsWith(`#`))continue;let t=/^[ \t]*-[ \t]+(.*)$/.exec(e);if(t&&i){r[i].push(c(t[1]??``));continue}let n=/^([A-Za-z0-9_-]+)[ \t]*:[ \t]*(.*)$/.exec(e);if(!n?.[1])continue;let a=n[1],o=(n[2]??``).trim();o===``?(r[a]=[],i=a):o.startsWith(`[`)&&o.endsWith(`]`)?(r[a]=l(o),i=null):(r[a]=c(o),i=null)}for(let[e,t]of Object.entries(r))Array.isArray(t)&&t.length===0&&(r[e]=``);return{data:r,body:t.slice(n[0].length)}}var d=Object.assign({"../../articles/_template.md":a,"../../articles/hello-world.md":o}),f=220,p=/([^/]+)\.md$/;function m(e){return typeof e==`string`?e:e?.join(`, `)??``}function h(e){return Array.isArray(e)?e:e?e.split(`,`).map(e=>e.trim()).filter(Boolean):[]}function g(e){return e.split(/\s+/).filter(Boolean).length}function _(e){for(let t of e.split(/\r?\n[ \t]*\r?\n/)){let e=t.trim();if(!(!e||e.startsWith(`#`)||e.startsWith("```")))return e.replace(/\s+/g,` `)}return``}function v(e,t){let n=p.exec(e)?.[1];if(!n||n.startsWith(`_`))return null;let{data:r,body:i}=u(t),a=m(r.slug)||n;return{slug:a,title:m(r.title)||a,date:m(r.date),updated:m(r.updated),summary:m(r.summary)||_(i),tags:h(r.tags),body:i,readingMinutes:Math.max(1,Math.round(g(i)/f))}}var y=Object.entries(d).map(([e,t])=>v(e,t)).filter(e=>e!==null).sort((e,t)=>Number(!e.date)-Number(!t.date)||t.date.localeCompare(e.date)||e.title.localeCompare(t.title));function b(e){return y.find(t=>t.slug===e)}function x(e){if(!e)return``;let t=new Date(e+`T00:00:00Z`);return Number.isNaN(t.getTime())?e:t.toLocaleDateString(`en-GB`,{day:`numeric`,month:`long`,year:`numeric`,timeZone:`UTC`})}var S=t();function C({article:t,className:a}){let o=x(t.date),s=t.updated===t.date?``:x(t.updated);return(0,S.jsxs)(`ul`,{className:`meta`+(a?` `+a:``),children:[o&&(0,S.jsxs)(`li`,{className:`meta__item`,children:[(0,S.jsx)(r,{className:`meta__icon`,"aria-hidden":`true`}),(0,S.jsx)(`time`,{dateTime:t.date,children:o})]}),s&&(0,S.jsxs)(`li`,{className:`meta__item`,children:[(0,S.jsx)(i,{className:`meta__icon`,"aria-hidden":`true`}),`updated `,(0,S.jsx)(`time`,{dateTime:t.updated,children:s})]}),(0,S.jsxs)(`li`,{className:`meta__item`,children:[(0,S.jsx)(n,{className:`meta__icon`,"aria-hidden":`true`}),t.readingMinutes,` min read`]}),t.tags.length>0&&(0,S.jsxs)(`li`,{className:`meta__item`,children:[(0,S.jsx)(e,{className:`meta__icon`,"aria-hidden":`true`}),t.tags.map(e=>(0,S.jsx)(`span`,{className:`meta__tag`,children:e},e))]})]})}export{y as n,b as r,C as t};