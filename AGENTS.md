# AGENTS.md

Guidance for AI coding agents and contributors. `CLAUDE.md` imports this file, and `.github/copilot-instructions.md` adds the review checklist.

## Language

- All deliverables are written in **English**: commit messages, PR/Issue titles and bodies, review comments, code comments and docstrings, and documentation (`README.md`, `AGENTS.md`, etc.).
- Exceptions (keep as is): quotations, technical identifiers, generated files, and external source text.
- Runtime messages (logs, errors) are English.
- Do not rewrite Git history to change the language of past commits.

## Overview

`fixdevcontainer` is a zero-dependency CLI published to npm. It sorts the top-level keys of a `devcontainer.json` into a fixed category order and writes the file back in place (2-space indent).
Keys that are not in the predefined order are kept, warned about, and appended alphabetically at the end.

## Commands

```bash
pnpm install                              # install dependencies
pnpm test                                 # Jest (the only script; no build, lint or format tool is configured)
node fixdevcontainer.js [file]            # run locally; the default file is .devcontainer/devcontainer.json
```

Node.js is pinned in `.node-version` and pnpm in `package.json`.
CI (`.github/workflows/nodejs-ci-pnpm.yml`, reusable workflow from `book000/templates`) runs the scripts present in `package.json` plus depcheck, so keep dependencies clean. `.depcheckrc.json` ignores `jest`.

## Structure

- `fixdevcontainer.js`: the whole implementation (CommonJS, shebang; package `bin` and `main`).
  - `predefinedOrder`: known keys grouped by category. This array defines the tool's behavior.
  - `loadJson(filename)`: returns the parsed object, or `null` after logging an error (missing file, read error, parse error).
  - `formatter(filename)`: reorders, appends unknown keys, writes back. Exported for tests, and also invoked at module load with `process.argv[2]`.
- `fixdevcontainer.test.js`: Jest tests with `node:fs` and `console` mocked; no real file I/O.
- `.github/workflows/release.yml`: on push to the default branch, bumps the version from commit prefixes (`feat` minor; `fix`, `docs`, `chore`, `refactor`, etc. patch; `release` major), then publishes to npm. Choose the commit type deliberately.

## Conventions

- CommonJS; import Node builtins with the `node:` prefix. Match the existing style (2 spaces, double quotes, semicolons).
- Output uses raw ANSI codes: red for errors (`console.error`), yellow for warnings (`console.warn`), green for success (`console.log`). Tests assert these exact strings, so update them together.
- On errors, log and return early; do not throw out of `loadJson` / `formatter`.
- To support a new `devcontainer.json` property, add it to `predefinedOrder` in the right category (each key once; keep category comments accurate) and add a test.
- Add a test for every behavior change.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/); branches follow [Conventional Branch](https://conventional-branch.github.io) short form (`feat/...`, `fix/...`).
- Do not commit to Renovate PRs. Never commit secrets.
