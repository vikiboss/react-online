# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Online Playground - A browser-based React code editor and preview environment that supports shareable URLs, automatic type acquisition, and third-party libraries via import maps.

**Live Demo**: https://react-online.vercel.app/ (backup: https://react-online.viki.moe/)

## Development Commands

```bash
# Start development server
pnpm dev

# Type checking and build
tsc && vite build

# Or just build
pnpm build

# Linting (uses Biome)
pnpm lint

# Linting with auto-fix (includes unsafe fixes)
pnpm lint:fix

# Preview production build
pnpm preview
```

**Package Manager**: This project uses `pnpm@10.18.2` (specified in packageManager field)

## Architecture

### Core Components Structure

The application uses a split-pane layout with three main sections:

1. **HeaderBar** (`src/components/header-bar/`) - Top navigation and controls
2. **CodeEditor** (`src/components/code-editor/`) - Monaco-based editor with TypeScript support
3. **PreviewZone** (`src/components/preview-zone/`) - Live preview iframe

### State Management

**Global Store** (`src/store.ts`):

- Uses `@shined/reactive` for reactive state management
- Manages file tree, active file, import map, and editor configuration
- Key state properties:
  - `fileTree`: Object mapping filenames to content (index.html, index.tsx, style.css)
  - `activeFile`: Currently selected file in editor
  - `importMap`: JSON string of ES module import map
  - `config`: Feature flags (unoCSS, waterCSS, autoImportMap)

### Key Technical Features

**1. Code Transformation** (`src/components/preview-zone/index.tsx`):

- Uses Sucrase to transform TypeScript/JSX to JavaScript at runtime
- Wraps user code with React DOM rendering logic
- Injects transformed code into HTML template via blob URL
- Error handling displays compilation errors in preview iframe

**2. Import Map Management** (`src/utils/import-map.ts`):

- **Auto-detection**: Parses import statements from code using regex
- **Auto-generation**: Creates import map entries pointing to esm.sh CDN
- **Merging**: Combines default imports (react, dayjs, @shined/react-use) with detected imports
- When `config.autoImportMap` is enabled, automatically updates import map on code changes

**3. URL Sharing** (`src/utils/url-compression.ts`):

- Compresses code using zlib and base64 encoding (borrowed from Vue REPL)
- Stores compressed code in URL hash parameter `?code=...`
- Decompresses on page load to restore shared code
- 300ms debounced updates to URL when code changes

**4. Automatic Type Acquisition** (`src/components/code-editor/monaco-editor/automatic-type-acquisition.ts`):

- Uses `@typescript/ata` to fetch type definitions for imported packages
- Provides IntelliSense for third-party libraries in Monaco editor
- Delegates to Monaco's TypeScript language service

### Monaco Editor Setup

**Configuration** (`src/components/code-editor/monaco-editor/monaco-editor-config.ts`):

- TypeScript compiler options: strict mode, JSX, ES2022
- Syntax highlighting powered by Shiki (one-dark-pro / one-light themes)
- Auto dark mode detection via `prefers-color-scheme` media query

### File Templates

Default files in `src/templates/`:

- `index.html` - Base HTML with placeholders for import map, script, and styles
- `index.tsx` - Default React component code
- `style.css` - Initial CSS

## Path Aliases

TypeScript and Vite configured with `@/*` alias mapping to `src/*`:

```typescript
import { store } from '@/store'
import { cn } from '@/utils/class-names'
```

## Code Style

**Linting**: Prettier

- Semicolons: "all" style
- Quotes: Single quotes
- Print width: 120 characters
- Indentation: 2 Spaces
- Templates folder (`src/templates/**`) excluded from linting

## Key Dependencies

- **Monaco Editor**: `@monaco-editor/react` + `monaco-editor` for code editing
- **Sucrase**: Fast TypeScript/JSX transformation (no Babel)
- **@shined/reactive**: Lightweight reactive state management
- **@typescript/ata**: Automatic Type Acquisition for Monaco
- **fflate**: Compression for shareable URLs
- **UnoCSS**: Atomic CSS framework (configured in vite.config.ts)

## Important Implementation Notes

- **Real-time compilation**: Code transformation happens in browser via Sucrase (not a build process)
- **Sandboxed preview**: iframe uses extensive sandbox permissions for security
- **CDN-based imports**: All third-party packages loaded from esm.sh
- **No backend**: Fully client-side application
- **Debounced updates**: 300ms debounce on code changes to reduce re-renders and URL updates
