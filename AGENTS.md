# AGENTS.md

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate` - Generate static site
- `npm run generate-pwa-icons` - Generate PWA icons

## Code Style Guidelines

### Formatting & Linting

- Uses Prettier with 2-space tabs, no tabs
- ESLint with Nuxt configuration + custom Vue HTML self-closing rules
- Run `npm run lint` to check code style

### Import Conventions

- Use `~/` prefix for internal imports (e.g., `~/stores/scoreboardStore`)
- External imports grouped separately from internal imports
- Vue imports: `import { computed, ref } from "vue"`

### TypeScript & Types

- Strict TypeScript enabled via Nuxt
- Define types in `types/` directory
- Use `type` for type aliases, `interface` for object shapes
- Pinia stores use `defineStore` with refs for state

### Vue Component Conventions

- Use `<script setup>` syntax
- Components in `app/components/` with PascalCase naming
- Composables in `app/composables/` with `use` prefix
- Store refs destructured with `storeToRefs`

### Styling

- Tailwind CSS with `cn()` utility for class merging
- Component-scoped styles preferred
- Dark mode support via `@nuxtjs/color-mode`

### Error Handling

- Use Vue's reactivity system for state management
- Pinia for global state with proper typing
- Avoid console.log in production code
