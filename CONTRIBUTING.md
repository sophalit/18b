# Contributing Guide

Thank you for your interest in contributing to the Telegram Mini App Shop! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/telegram-mini-shop.git
cd telegram-mini-shop
```

3. Install dependencies:
```bash
npm run install-all
```

4. Create a `.env` file in the backend directory and configure it
5. Run database migrations:
```bash
cd backend && npm run migrate
```

6. Start development servers:
```bash
npm run dev
```

## Project Structure

```
telegram-mini-shop/
├── backend/              # Express backend
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── types/       # TypeScript types
│   │   └── server.ts    # Entry point
│   └── package.json
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── styles/     # CSS styles
│   │   ├── types/      # TypeScript types
│   │   ├── utils/      # Utility functions
│   │   └── App.tsx     # Main app
│   └── package.json
└── package.json         # Root package.json
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type when possible
- Enable strict mode

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Follow existing code patterns

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Components**: PascalCase
- **Functions**: camelCase

### Comments

- Write clear, concise comments
- Document complex logic
- Use JSDoc for function documentation

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards
- Test your changes thoroughly
- Update documentation if needed

### 3. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git commit -m "Add user authentication feature"
```

Good commit messages:
- Start with a verb (Add, Fix, Update, Remove)
- Be concise but descriptive
- Reference issues when applicable

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title
- Description of changes
- Screenshots (if UI changes)
- Link to related issues

## Testing

### Backend Testing

```bash
cd backend
npm test
```

Write tests for:
- API endpoints
- Database models
- Business logic
- Middleware

### Frontend Testing

```bash
cd frontend
npm test
```

Write tests for:
- Components
- User interactions
- API integration
- Utility functions

## Adding Features

### Adding a New API Endpoint

1. Create route handler in `backend/src/routes/`
2. Add database model if needed in `backend/src/models/`
3. Update types in `backend/src/types/`
4. Test the endpoint
5. Update API.md documentation

### Adding a New Component

1. Create component in `frontend/src/components/`
2. Add styles in `frontend/src/styles/`
3. Update types if needed
4. Test the component
5. Update documentation

### Adding a New Page

1. Create page in `frontend/src/pages/`
2. Add routing logic in `App.tsx`
3. Add styles
4. Test navigation
5. Update documentation

## Database Changes

### Adding a Migration

1. Update `backend/src/config/migrate.ts`
2. Add new table/column definitions
3. Test migration locally
4. Document changes

### Modifying Models

1. Update model in `backend/src/models/`
2. Update types in `backend/src/types/`
3. Update affected routes
4. Test changes

## Documentation

Update documentation when you:
- Add new features
- Change API endpoints
- Modify configuration
- Add new dependencies

Files to update:
- `README.md` - Main documentation
- `API.md` - API endpoints
- `DEPLOYMENT.md` - Deployment instructions
- `QUICKSTART.md` - Quick start guide

## Code Review Process

1. Submit PR with clear description
2. Wait for CI/CD checks to pass
3. Address reviewer comments
4. Make requested changes
5. Wait for approval
6. Merge when approved

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create release tag
4. Build and test
5. Deploy to production

## Getting Help

- Check existing documentation
- Search existing issues
- Ask in discussions
- Contact maintainers

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to:
- Open an issue
- Start a discussion
- Contact the maintainers

Thank you for contributing! 🎉
