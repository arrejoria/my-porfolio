# Personal Portfolio Website

A personal portfolio built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/Base UI, Lucide, Better Auth, Drizzle ORM, PostgreSQL, and pnpm.

## Stack

| Technology | Role |
| --- | --- |
| Next.js 16 | Application framework |
| React 19 | UI library |
| TypeScript | Type-safe application code |
| Tailwind CSS 4 | Styling |
| shadcn/Base UI | UI components and primitives |
| Lucide | Icons |
| Better Auth | Authentication |
| Drizzle ORM | Database access |
| PostgreSQL | Database |
| pnpm | Package manager |

## Getting started

Install dependencies with pnpm:

```sh
pnpm install
```

No environment-variable or additional setup commands are documented here because they are not confirmed in this README.

## Current follow-up priorities

These priorities are not necessarily fixed; confirm scope before treating any item as committed work.

- Routes `/blog` and `/contact` are currently linked, but their pages are absent.
- TypeScript build errors are ignored in `next.config.mjs`.
- A test and CI baseline still needs to be established.
- Coverage exclusions for environment files need review.
- Production authentication must validate secrets, allowed origins, and rate limiting.

## End-to-end testing with Playwright

Playwright can validate the portfolio's critical browser journeys, such as navigation, linked routes, authentication flows, and responsive interaction. It is a suitable option when establishing the E2E baseline; this README does not claim Playwright is installed as an application dependency.

## Optional global AI skills

These tools are optional global AI-agent tools. They are not runtime dependencies and are not listed in `package.json`.

| Skill | Purpose | Install globally |
| --- | --- | --- |
| `vercel-react-best-practices` | React and Next.js performance guidance | `npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y` |
| `better-auth-security-best-practices` | Better Auth security guidance | `npx skills add better-auth/skills@better-auth-security-best-practices -g -y` |
| `web-design-guidelines` | UI design and accessibility review guidance | `npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y` |
| `playwright-skill` | Playwright E2E automation guidance | `npx skills add testdino-hq/playwright-skill@playwright-skill -g -y` |
| `code-review` | Standards- and specification-focused code review guidance | `npx skills add mattpocock/skills@code-review -g -y` |
