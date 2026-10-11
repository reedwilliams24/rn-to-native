This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Linked lines in snippets

A snippet's three files (`content/<chapter>/<snippet>/{rn.tsx,android.kt,ios.swift}`) can tie equivalent lines together. Hovering, focusing, or tapping one of those lines highlights the matching lines in the other columns. To link a line, end it with a marker:

```kotlin
var count by remember { mutableStateOf(0) } // @link:state
```

- Use `// @link:<id>` at the end of a line. Inside JSX children, where `//` would render as text, use `{/* @link:<id> */}`.
- Give one line several ids with commas (`// @link:fn,props`). Lines match when they share any id.
- An id has to appear in at least two of the three files, or the build fails. This catches typos.
- Markers are removed before Shiki highlights the code, so they never show up on the site. Because they're ordinary comments, the `.kt` and `.swift` files still compile.
- Snippets without markers render exactly as before. Every snippet with a cross-platform equivalent is annotated (`content/components/` is a good reference). Leave lines with no counterpart, such as platform-only setup, unlinked.
