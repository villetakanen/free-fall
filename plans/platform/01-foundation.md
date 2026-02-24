# 01 — Foundation

**Goal:** Monorepo scaffold with `pnpm install` succeeding from a fresh clone.

## Deliverables

- `pnpm-workspace.yaml` declaring `apps/*` and `packages/*`
- Root `package.json` (private, workspace script stubs)
- Root `tsconfig.json` (strict mode base config)
- `.npmrc` if needed for pnpm settings
- Empty placeholder dirs for `apps/` and `packages/`

## Done When

- `pnpm install` exits 0 from repo root
- `tsc --noEmit` exits 0 (nothing to check yet, but config is valid)
