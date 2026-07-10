# Copilot code review instructions

Guidance for reviewing pull requests in this repository.

## Project

`fixdevcontainer` is a zero-dependency Node.js CLI that reorders the top-level keys
of a `devcontainer.json` into a fixed category order. The whole implementation lives
in `fixdevcontainer.js`; tests are in `fixdevcontainer.test.js` (Jest).

## Tech stack

- Node.js (version pinned in `.node-version`), CommonJS modules.
- pnpm for package management; Jest for tests.
- No lint/format tool is configured, so enforce style by consistency with the
  existing code, not by tooling.

## Review focus

- **Sort order (`predefinedOrder`)**: verify new keys are placed in the correct
  category and that category comments stay accurate. Flag duplicated keys within
  the array (`userEnvProbe` currently appears twice — call out any new duplicates).
- **Unknown-key handling**: keys absent from `predefinedOrder` must still be
  preserved and appended alphabetically. Flag changes that could silently drop keys.
- **Error handling**: `loadJson`/`formatter` must log and return early on missing
  file, read failure, and JSON parse failure rather than throwing. Flag new code
  paths that throw uncaught or write partial output.
- **Console output**: messages use exact ANSI escape codes (red `[31m` errors,
  yellow `[33m` warnings, green `[32m` success). Flag output changes that are not
  matched by a corresponding test update, since tests assert exact strings.
- **Tests**: any change to sorting behavior or messages should come with updated or
  new Jest cases. Tests mock `node:fs` and `console`, so flag tests that perform
  real filesystem I/O.

## Style

- CommonJS `require`/`exports`; import builtins with the `node:` prefix.
- 2-space indentation, double quotes, semicolons.

## Do not flag

- Absence of a lint/format config or a build step — this is intentional.
- Raw ANSI escape sequences in strings — these are the intended output format.
- The lack of runtime dependencies — the tool is deliberately dependency-free.

## Language

Write review comments in Japanese, matching the repository's commit history.
