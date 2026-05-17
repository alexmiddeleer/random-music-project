# Agent Instructions

Use `mise` for runtime and tool execution in this project.

Use `pnpm` for all package management and project scripts. Do not use `npm`, `yarn`, or `npx`.

Prefer running commands through `mise exec --`, for example:

```sh
mise exec -- pnpm install
mise exec -- pnpm dev
mise exec -- pnpm build
mise exec -- pnpm preview
```

When changing dependencies, update them with `pnpm` so `package.json` and `pnpm-lock.yaml` stay consistent.

For browser-facing UI changes, use the `firefox-devtools` MCP tools for visual checks during TDD. Start the app with `mise exec -- pnpm dev`, navigate Firefox to `http://localhost:5173`, and save screenshots to disk when they are useful evidence.
