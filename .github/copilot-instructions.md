# Copilot Instructions for AI Agents

## Project Overview
- This is a React-based sales management app, bootstrapped with Create React App.
- Main source code is in `src/`, with entry point at `src/index.js` and main component in `src/App.js`.
- Static assets and configuration files are in `public/`.

## Developer Workflows
- **Start development server:** `npm start` (runs on http://localhost:3000)
- **Run tests:** `npm test` (Jest, watch mode)
- **Build for production:** `npm run build` (outputs to `build/`)
- **Eject config:** `npm run eject` (irreversible, exposes build configs)

## Code Structure & Patterns
- All React components are currently in `src/`. No subfolders for features or modules yet.
- CSS files (`App.css`, `index.css`) are imported directly in JS files.
- No custom hooks, context, or advanced state management detected; state is likely managed via React's useState/useEffect.
- No API integration or external service calls found in the initial structure.
- Tests are in `src/App.test.js` and use Jest (default from Create React App).

## Conventions & Practices
- Follows Create React App conventions for file naming and structure.
- No TypeScript, Redux, or other major libraries detected.
- No custom linting, formatting, or CI/CD rules found.
- No `.github/copilot-instructions.md` or other agent-specific rules previously present.

## Key Files
- `src/App.js`: Main app component, entry for UI logic.
- `src/index.js`: ReactDOM render entry point.
- `public/index.html`: HTML template for the app.
- `README.md`: Contains basic workflow and script instructions.

## Example Patterns
- Component imports: `import React from 'react';`
- CSS imports: `import './App.css';`
- Test example: `import { render, screen } from '@testing-library/react';`

## Guidance for AI Agents
- Follow Create React App conventions unless directed otherwise.
- When adding new features, place components in `src/` and update imports in `src/App.js` or `src/index.js`.
- Use functional components and hooks (useState, useEffect) for new logic.
- For new tests, add to `src/App.test.js` or create new `*.test.js` files in `src/`.
- If introducing new libraries or patterns, document them in `README.md`.

---

*Update this file as the codebase evolves, especially when introducing new architecture, workflows, or conventions.*
