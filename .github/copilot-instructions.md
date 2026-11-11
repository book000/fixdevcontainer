# Copilot code review instructions

Read `AGENTS.md` at the repository root first; it is the source of truth for structure, commands and conventions.

## Language

Write review comments, and expect all deliverables (code comments, docs, commit messages, PR text), in English.
Runtime log and error messages are English too.

## Review checklist

- `predefinedOrder`: new keys are in the right category, appear only once, and category comments stay accurate.
- Unknown keys must still be preserved and appended alphabetically; flag anything that could drop keys.
- `loadJson` / `formatter` must log and return early on errors instead of throwing or writing partial output.
- Changes to ANSI-coded messages or sort behavior must come with matching test updates.
- Tests must keep `node:fs` and `console` mocked (no real file I/O).
- Commit and PR titles follow Conventional Commits; the type drives the released version (see `release.yml`).

## Do not flag

- No lint/format config or build step, raw ANSI escape sequences, and zero runtime dependencies are all intentional.
