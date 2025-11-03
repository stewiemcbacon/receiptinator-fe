# React Skeleton App

A modern React application template built with Vite, Material-UI, and latest best practices.

## Features

- **React 18** - Latest version with modern hooks and patterns
- **TypeScript** - Full type safety and better developer experience
- **Vite 6** - Lightning fast development and build tool
- **Material-UI v6** - Comprehensive React component library
- **Dark/Light Theme** - Seamless theme toggle with automatic persistence
- **Responsive Design** - Mobile-first approach for all screen sizes
- **Retractable Sidebar** - Smooth navigation with responsive behavior
- **React Router v6** - Declarative routing
- **CSS-in-JS** - Emotion styling engine

## Project Structure

```
react-skeleton/
├── public/             # Static assets
├── src/
│   ├── components/
│   │   └── layout/    # Layout components (Header, Sidebar, AppLayout)
│   ├── pages/         # Page components (Home, Dashboard, Settings, About)
│   ├── theme/         # MUI theme configuration
│   ├── App.tsx        # Main app component with routing
│   └── main.tsx       # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features Explained

### Theme Toggle

The app uses MUI v6's built-in `colorSchemes` API for automatic dark/light mode with localStorage persistence. Click the sun/moon icon in the header to toggle themes.

### Responsive Sidebar

The sidebar automatically adapts to screen size:
- **Desktop (>= 960px)**: Permanent sidebar
- **Mobile (< 960px)**: Collapsible drawer overlay

### Navigation

Navigate between pages using the sidebar menu. The active route is automatically highlighted.

## Customization

### Adding New Pages

1. Create a new component in `src/pages/` (e.g., `NewPage.tsx`)
2. Add the route in `src/App.tsx`
3. Add menu item in `src/components/layout/Sidebar.tsx`

### Customizing Theme

Edit `src/theme/theme.ts` to customize colors, typography, and component styles.

## Tech Stack

- React 18.3.1
- TypeScript 5.7.2
- Vite 6.0.1
- Material-UI 6.1.9
- React Router 6.28.0
- Emotion 11.13.5

## License

MIT
