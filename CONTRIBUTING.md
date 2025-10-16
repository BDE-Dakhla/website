# Contributing to BDE Dakhla

Thank you for your interest in contributing! This project is licensed under the PolyForm Noncommercial License 1.0.0, which means contributions must be for noncommercial purposes only.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/bde-dakhla.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Follow the setup instructions in [README.md](README.md)

## Development Workflow

### Before You Start

- Check existing issues and pull requests to avoid duplicate work
- For major changes, open an issue first to discuss your proposal
- Read [AGENTS.md](AGENTS.md) for project-specific guidelines

### Code Standards

**TypeScript:**

- Use strict mode (no `any` types)
- Follow existing code style and patterns
- Use `cn()` helper for className attributes (never string templates)

**Testing:**

- Write unit tests for new utilities and functions
- Write integration tests for API changes
- Run `bun run test` before submitting
- Ensure all tests pass

**Code Quality:**

```bash
bun run test              # Run all tests
bun run test:coverage     # Check coverage
bun run lint:fix          # Fix linting issues
```

### Commit Guidelines

- Write clear, concise commit messages
- Use conventional commit format: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
- Reference related issues: `fix: resolve #123`

### Pull Request Process

1. Update your branch with latest main: `git pull origin main`
2. Run full test suite and linting
3. Push your changes: `git push origin feature/your-feature-name`
4. Open a PR with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots (if UI changes)
   - Test results

## Project Structure

```bash
app/              # Next.js app directory
components/       # React components
lib/              # Utilities, database, API logic
tests/            # Test files (unit & integration)
types/            # TypeScript type definitions
```

## Testing Practices

- **Unit tests:** Pure functions and utilities
- **Integration tests:** API routes with full request/response
- **Mocks:** Use fixtures in `tests/` directory
- **Coverage:** Aim for meaningful coverage, not just numbers

See [AGENTS.md](AGENTS.md) for detailed testing guidelines.

## License Agreement

By contributing, you agree that your contributions will be licensed under the same PolyForm Noncommercial License 1.0.0 as the project. You retain copyright to your contributions but grant the project maintainers the rights specified in the license.

## Questions?

- Open an issue for bugs or feature requests
- Check existing documentation in `/docs` or fumadocs
- Contact maintainers for sensitive matters

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors
