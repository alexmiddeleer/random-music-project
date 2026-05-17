# Audio Instrument

A web app for browser-playable audio instruments, starting with a piano preset and shaped to support more instruments, sheet music, and composition tools.

## Requirements

- [mise](https://mise.jdx.dev/)
- [pnpm](https://pnpm.io/)

## Setup

```sh
mise install
mise exec -- pnpm install
```

## Scripts

```sh
mise exec -- pnpm dev
mise exec -- pnpm build
mise exec -- pnpm preview
```

## Project Status

The app currently boots a two-octave piano preset through generic Instrument, Control, Input Mapping, Voice, and Composition modules.
