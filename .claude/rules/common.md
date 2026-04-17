---
name: common
description: Universal coding rules applied across all languages and projects.
---

# Common Rules

- **Research before coding** — check docs or use WebSearch before implementing unfamiliar APIs. Don't guess.
- **Never commit secrets** — no API keys, passwords, or tokens in code. Always use environment variables. Add `.env` to `.gitignore`.
- **Every feature needs a test** — no feature is done until it has a test covering the critical path.
- **Structured errors** — always return errors with `code`, `message`, and `context` fields. Never expose stack traces to users.
- **Conventional commits** — use `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:` prefixes.
- **No console.log in production** — use a structured logger (pino, winston, Python logging).
- **Document the why, not the what** — code explains what it does. Comments explain why it does it that way.
- **Fail fast** — validate inputs at the boundary. Don't pass bad data deep into the system.
- **No dead code** — delete unused functions, imports, and variables. Don't comment them out.
