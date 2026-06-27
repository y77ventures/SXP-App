# Contributing to SwimXP Connect

Thank you for your interest in contributing. This document outlines the development workflow, coding standards, and pull request process.

---

## Development Workflow

1. Fork the repository and clone your fork
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Make your changes following the coding standards below
4. Run type checks: `pnpm check`
5. Format your code: `pnpm format`
6. Commit with a conventional commit message (see below)
7. Push your branch and open a pull request against `main`

---

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

| Type | Usage |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no feature/fix |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `chore` | Build process, dependency updates |

**Examples:**
```
feat(matches): add swipe gesture with spring physics
fix(booking): prevent double-submit on confirm step
docs(setup): add PostgreSQL setup instructions
```

---

## Coding Standards

### TypeScript
- All new files must be `.tsx` (components) or `.ts` (utilities)
- Avoid `any` — use proper types or `unknown` with type guards
- Export types alongside their implementations

### React
- Functional components only — no class components
- Custom hooks in `client/src/hooks/` prefixed with `use`
- Keep page components thin — extract reusable UI into `client/src/components/`
- Never call `setState` or navigation in the render phase — use `useEffect`

### Styling
- Use Tailwind utility classes; avoid inline styles
- Design tokens live in `client/src/index.css` — do not hard-code colour hex values in components
- Mobile-first: write base styles for mobile, then `md:` and `lg:` overrides
- Animate only `transform` and `opacity` for GPU-accelerated motion

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts`
- Utilities: `camelCase.ts`
- Pages: `PascalCase.tsx`

---

## Pull Request Checklist

Before submitting a PR, confirm:

- [ ] `pnpm check` passes with zero TypeScript errors
- [ ] `pnpm format` has been run
- [ ] New components are documented with a brief JSDoc comment
- [ ] No `console.log` statements left in production code
- [ ] Mobile layout tested at 390px viewport width
- [ ] No hardcoded colour values — use CSS tokens

---

## Reporting Issues

Open a GitHub Issue with:
- A clear title describing the problem
- Steps to reproduce
- Expected vs actual behaviour
- Browser and OS version
- Screenshot or screen recording if applicable

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
