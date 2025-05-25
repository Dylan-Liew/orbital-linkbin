# LinkBin

A unified platform to share links, images, and text—fast and effortlessly.

## Features

- **Link Shortening Service**  
  Create shortened URLs with basic analytics.
- **Screenshot Upload**  
  Image hosting with direct upload and generated links.
- **Text Sharing**  
  Pastebin-like functionality with syntax highlighting for code snippets.
- **Link Management Dashboard**  
  Centralized interface for managing all created links.

## Tech Stack

- **Frontend:** ReactJS, TailwindCSS
- **Backend:** NextJS API routes
- **Database:** MySQL
- **Authentication:** JWT
- **Deployment:** Vercel and Github Action CI/CD
- **Testing:** Jest

## Command Guide

- `npm run dev` — Start the development server
- `npm run build` — Build the application for production
- `npm run start` — Start the production server
- `npm run test` — Run tests

## Configuration/Installation

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your environment variables as needed (see `.env.example` if available).
4. Start the development server as described above.

## Semantic Commit Messages

Format: `<type>(<scope>): <subject>`

`<scope>` is optional

Example:

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

More Examples:
- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

References:

- https://www.conventionalcommits.org/