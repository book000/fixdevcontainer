# CLAUDE.md

## Overview

`fixdevcontainer` is a zero-dependency CLI that sorts the top-level keys of a
`devcontainer.json` file into a fixed, human-friendly category order (basic info,
container image, operational settings, ports, features, lifecycle commands, etc.).
It is published to npm and typically run with `npx fixdevcontainer`. Unknown keys
are preserved and appended alphabetically at the end with a warning.

## Development commands

- `pnpm test`: run the Jest test suite (`fixdevcontainer.test.js`). This is the
  only script and is what CI runs. There is no build step and no lint/format tool
  configured.
- `npx fixdevcontainer [file]`: run the tool. Defaults to
  `.devcontainer/devcontainer.json` when no path is given.

Use pnpm (see `packageManager` in `package.json`). Node version is pinned in
`.node-version`.

## Architecture / key files

- `fixdevcontainer.js`: the entire implementation. CommonJS, `"use strict"`, with
  a `#!/usr/bin/env node` shebang; it is the package `bin` and `main`.
  - `predefinedOrder`: the ordered array of known keys, grouped by category with
    comments. This array is the heart of the tool.
  - `loadJson(filename)`: reads and parses the file, returning `null` on any error
    (missing file, read error, parse error).
  - `formatter(filename)`: reorders keys per `predefinedOrder`, appends unknown
    keys alphabetically, and writes the result back with `JSON.stringify(obj, null, 2)`.
    Exported via `exports.formatter` for tests; also invoked at module load using
    `process.argv[2]`.
- `fixdevcontainer.test.js`: Jest tests that mock `node:fs` and the `console`
  methods.
- `.github/workflows/`: CI (`nodejs-ci-pnpm.yml`) and npm publish (`release.yml`)
  reuse `book000/templates` workflows.

## Coding conventions

- CommonJS (`require`/`exports`), not ESM. Import Node builtins with the `node:`
  prefix (e.g. `require("node:fs")`).
- 2-space indentation, double-quoted strings, semicolons — match the existing file.
- User-facing output uses raw ANSI escape codes: red (`[31m`) for errors via
  `console.error`, yellow (`[33m`) for warnings via `console.warn`, green
  (`[32m`) for success via `console.log`. The tests assert these exact
  strings, so keep the escape sequences and message wording in sync with the tests.
- On errors, log a message and return early (return `null`/`undefined`); do not
  throw out of `formatter`/`loadJson`.

## Adding or changing sorted keys

When adding support for a new `devcontainer.json` property, insert it into
`predefinedOrder` in the appropriate category (keep the section comments accurate).
Note that `formatter` copies only keys present in `predefinedOrder` into the sorted
object; any key not listed there is treated as "undefined" and appended
alphabetically. Update `fixdevcontainer.test.js` to cover the new ordering.

## Testing approach

Tests mock `node:fs` (`existsSync`/`readFileSync`/`writeFileSync`) and stub
`console.log`/`warn`/`error`, then assert the arguments passed to `writeFileSync`
and the console output. There is no real filesystem I/O in tests. Add a case for
every new behavior rather than relying on manual runs.

## Commit / release rules

- Commits follow Conventional Commits; descriptions are written in Japanese by
  default (matching the existing history).
- `release.yml` parses commit prefixes to bump the version and publish to npm:
  `feat` → minor, `fix`/`chore`/`docs`/`refactor`/etc. → patch, `release` → major.
  Choose the prefix deliberately since it drives the released version.
