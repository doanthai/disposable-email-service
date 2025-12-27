# Contributing Guide

Thank you for your interest in contributing to this project!

## Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to automatically determine version bumps. Please follow this format when committing:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature (triggers MINOR version bump)
- **fix**: A bug fix (triggers PATCH version bump)
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semi colons, etc.)
- **refactor**: Code refactoring without feature changes or bug fixes
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates, etc.

### Breaking Changes

To trigger a MAJOR version bump, include `BREAKING CHANGE:` in the footer or add `!` after the type:

```
feat!: change API signature

BREAKING CHANGE: The getMail() method now returns a Promise
```

Or:

```
feat(api)!: remove deprecated method
```

### Examples

**Minor version bump (new feature):**
```
feat: add support for TempMail service
```

**Patch version bump (bug fix):**
```
fix: resolve cookie handling issue in headless mode
```

**Major version bump (breaking change):**
```
feat!: change DisposableEmailHelper constructor signature

BREAKING CHANGE: Constructor now requires options parameter
```

**No version bump (documentation):**
```
docs: update README with usage examples
```

## Version Format

All versions must follow Semantic Versioning format: **x.x.x** (major.minor.patch)

You can validate the version format using:
```bash
npm run version:check
```

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests if applicable
4. Commit using conventional commit format
5. Push and create a Pull Request
6. After merge, Lerna will automatically determine the next version based on commit messages

## Publishing

Version bumps and publishing are handled automatically by Lerna based on your commit messages. No need to manually update version numbers!

