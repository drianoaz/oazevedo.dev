# Contributing to Oazevedo

Thank you for your interest in contributing! This document provides guidelines and information to help you get started.

## 🚀 Technology Overview

This project is built with modern web technologies:

- **Framework**: [Next.js 15](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- **Linting**: [ESLint 9](https://eslint.org/) - JavaScript/TypeScript linting
- **Formatting**: [Prettier](https://prettier.io/) - Code formatter

## 🛠️ Required Software

### Node.js and npm

- **Node.js**: Version `^22.18.0`
- **npm**: Version `^10.9.3`

You can check your versions with:

```bash
node --version
npm --version
```

### Recommended VS Code Extensions

To enhance your development experience, we recommend installing these VS Code extensions:

- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)** - JavaScript and TypeScript linting
- **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** - Automatic code formatting
- **[EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)** - Override user/workspace settings with settings
- **[Format Code Action](https://marketplace.visualstudio.com/items?itemName=rohit-gohri.format-code-action)** - Run eslint extension after the prettier extension in VS Code
- **[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)** - Enhances the Tailwind development experience

> Note: The project is already configured for these extensions to work together, so having them installed will provide a better development experience.

## 📜 Available npm Scripts

The following commands are available for development:

```bash
# Development
npm run dev            # Start development server with Turbopack
npm run build          # Build the application for production
npm run start          # Start production server

# Code Quality
npm run lint           # Run ESLint to check code quality
npm run check:types    # Run TypeScript type checking
npm run check:prettier # Check if code is properly formatted
npm run format         # Format code with Prettier
```

## 🤝 How to Contribute

### 1. Fork the Repository

1. Go to the [Oazevedo repository](https://github.com/drianoaz/oazevedo)
2. Click the "Fork" button in the top-right corner
3. This creates a copy of the repository under your GitHub account

### 2. Clone Your Fork

```bash
git clone git@github.com:yourusername/oazevedo.dev.git
cd oazevedo
```

### 3. Set Up the Development Environment

```bash
# Install dependencies
npm install
```

### 4. Create a Branch

```bash
git checkout -b your-feature-name
```

### 5. Make Your Changes

- Write your code following the project's coding standards
- Ensure your code passes all linting and type checks
- Write or update tests if applicable
- Update documentation if needed

### 6. Test Your Changes

```bash
# Run linting
npm run lint

# Check TypeScript types
npm run check:types

# Check code formatting
npm run check:prettier

# Format code if needed
npm run format
```

### 7. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
# or
git commit -m "fix: resolve issue description"
```

**Commit Message Guidelines:**

- Use [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep descriptions clear and concise

### 8. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 9. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select the `main` branch
4. Write a clear description of your changes
5. Reference any related issues
6. Submit the pull request

## 🐛 Reporting Issues

**It's absolutely fine to open issues!** We welcome bug reports, feature requests, and general feedback.

When opening an issue, please include:

- **Clear description** of the problem or feature request
- **Steps to reproduce** (for bugs)
- **Expected vs actual behavior**
- **Environment details** (OS, browser, Node.js version)
- **Screenshots or code examples** if applicable

## 📋 Code Standards

- Follow the existing code style and formatting
- Use TypeScript for all new code
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Follow React and Next.js best practices

## 🔧 Development Workflow

1. **Always pull latest changes** before starting work
2. **Create feature branches** for each change
3. **Test thoroughly** before submitting
4. **Keep commits atomic** and well-described
5. **Respond to review feedback** promptly

## 🎉 Getting Help

If you need help or have questions:

- Check existing issues
- Open a new issue for questions

---

Thank you for contributing! 🚀
