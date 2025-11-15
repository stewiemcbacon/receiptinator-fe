# Receiptinator - Project Overview

## Application Goal

**Receiptinator** is a mobile-first receipt management application that allows users to capture, process, and manage their receipts digitally. The application provides a seamless workflow for receipt tracking and expense management.

### Key Objectives

- **Receipt Upload & Capture**: Enable users to upload receipt images or take photos directly using their device camera
- **Automated Processing**: Receipt images trigger an n8n workflow that analyzes the receipt content and extracts relevant data
- **Database Integration**: Processed receipt data is automatically stored in a database
- **Receipt Management**: Front-end displays all receipts with comprehensive information including items, totals, and metadata
- **Mobile-First Experience**: Optimized for mobile devices with responsive design and touch-friendly interfaces

### User Workflow

1. User opens the app on their mobile device
2. User uploads a receipt image or takes a photo using the device camera
3. Receipt is sent to n8n workflow for automated analysis
4. Extracted data (store, date, items, prices, totals) is inserted into the database
5. Receipt appears on the `/receipts` page with all parsed information
6. User can search, filter, and view receipts by month with detailed breakdowns

---

## Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern UI library with hooks and concurrent features
- **TypeScript 5.7.2** - Type-safe JavaScript for robust development
- **Vite 6.0.1** - Next-generation frontend build tool with lightning-fast HMR

### UI Library & Styling
- **Material-UI (MUI) 6.1.9** - Comprehensive React component library following Material Design
- **MUI Icons Material 6.1.9** - Material Design icon set
- **Emotion 11.13.5** - CSS-in-JS styling engine for dynamic component styling
- **Theme Support** - Light/dark mode with automatic persistence

### Routing & Navigation
- **React Router DOM 6.28.0** - Declarative client-side routing
- Routes: `/` (Home), `/dashboard`, `/receipts`, `/settings`, `/about`

### HTTP Client
- **Axios 1.13.1** - Promise-based HTTP client for API communication
- Configured with interceptors for request/response handling
- Base URL: `http://192.168.178.205:8080` (configurable via `VITE_API_URL` environment variable)

### Development Tools
- **ESLint 9.15.0** - Code linting with TypeScript, React, and React Hooks plugins
- **Prettier 3.4.2** - Opinionated code formatter
- **TypeScript ESLint** - TypeScript-specific linting rules

---

## Project Structure

```
receiptinator-fe/
├── src/
│   ├── pages/                     # Page components (routes)
│   │   ├── Home.tsx              # Landing page with feature showcase
│   │   ├── Dashboard.tsx         # Dashboard with metrics
│   │   ├── Receipts.tsx          # Main receipts view (primary feature)
│   │   ├── Settings.tsx          # User settings/preferences
│   │   └── About.tsx             # About page with tech info
│   │
│   ├── components/               # Reusable UI components
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx    # Main layout wrapper
│   │   │   ├── Header.tsx       # Top navigation bar
│   │   │   └── Sidebar.tsx      # Collapsible navigation menu
│   │   ├── ReceiptCard.tsx      # Individual receipt card
│   │   ├── ReceiptFilters.tsx   # Search/filter controls
│   │   ├── ReceiptsTable.tsx    # Table view for receipts
│   │   └── MonthHeader.tsx      # Sticky month section header
│   │
│   ├── services/                 # API service layer
│   │   ├── api.ts               # Axios instance configuration
│   │   └── receipts.service.ts  # Receipt API endpoints
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── receipt.types.ts     # Receipt-related interfaces
│   │
│   ├── theme/                    # MUI theme configuration
│   │   └── theme.ts             # Custom theme with light/dark modes
│   │
│   ├── App.tsx                   # Root component with routing
│   ├── main.tsx                  # Application entry point
│   └── vite-env.d.ts            # Vite environment types
│
├── vite.config.ts                # Vite build configuration
├── tsconfig.json                 # TypeScript compiler options
├── .prettierrc.cjs              # Prettier code formatting rules
├── package.json                  # Dependencies and scripts
└── index.html                    # HTML entry point
```

---

## Coding Style & Conventions

### Prettier Configuration
- **Semi-colons**: Enabled (`;`)
- **Quotes**: Single quotes (`'`)
- **Trailing Commas**: None
- **Print Width**: 120 characters
- **Tab Width**: 4 spaces
- **Bracket Spacing**: Enabled
- **Single Attribute Per Line**: Enabled (JSX)

### TypeScript Conventions
- **Strict Mode**: Enabled for type safety
- **Interface-First**: Prefer `interface` over `type` for object shapes
- **Explicit Types**: Function parameters and return types are explicitly typed
- **Type Imports**: Use `import type` where applicable

### React Patterns
- **Functional Components**: All components use function syntax with `React.FC<Props>`
- **Hooks**: Modern React hooks (useState, useEffect, useCallback, useRef)
- **Props Interfaces**: Each component has a dedicated props interface
- **Component Organization**:
  - Imports
  - Type definitions
  - Component function
  - Helper functions (inside component when using state, outside when pure)
  - Export default

### Component Structure Example
```typescript
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ComponentProps } from '../types';

const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
    const [state, setState] = useState<Type>(initialValue);

    const handleAction = () => {
        // Handler logic
    };

    return (
        <Box>
            <Typography> variant="h6">{prop1}</Typography>
        </Box>
    );
};

export default ComponentName;
```

### MUI Styling Approach
- **`sx` Prop**: Primary styling method for inline styles
- **Emotion**: For more complex/reusable styles
- **Theme**: Consistent spacing, colors, and breakpoints from theme
- **Responsive Design**: Use MUI Grid2 with size breakpoints (`xs`, `sm`, `md`, `lg`, `xl`)

### State Management
- **Local State**: React `useState` for component-level state
- **Context**: MUI theme context for global theme state
- **No External State Library**: Simple prop drilling for data flow
- **Async State**: `useEffect` + async/await for data fetching

### API Communication
- **Centralized Axios Instance**: Configured in `services/api.ts`
- **Service Layer**: Dedicated service files for API calls
- **Error Handling**: Try-catch blocks with user-friendly error messages
- **Loading States**: Boolean flags for loading/error states

---

## Key Features

### 1. Receipt Display & Management
- **Card View**: Grid layout with expandable receipt cards
- **Table View**: Dense table format for quick scanning
- **View Toggle**: Switch between card and table views
- **Infinite Scroll**: Automatic loading of more receipts (card view)
- **Pagination**: Server-side pagination with 20 items per page

### 2. Search & Filtering
- **Text Search**: Search by store name or item name
- **Debounced Input**: 500ms delay to reduce API calls
- **Month Filter**: Filter receipts by specific month (YYYY-MM)
- **Available Months**: Dynamic dropdown of months with receipts
- **Filter Persistence**: Filters maintained during view mode changes

### 3. Receipt Grouping & Aggregation
- **Monthly Grouping**: Receipts grouped by month in card view
- **Sticky Month Headers**: Month headers remain visible while scrolling
- **Monthly Totals**: Display total spent and receipt count per month
- **Summary Statistics**: Total receipt count across all filters

### 4. Receipt Details
- **Store Name & Date**: Primary receipt information
- **Financial Breakdown**: Subtotal, tax, and total amounts
- **Line Items**: Expandable table showing all purchased items
- **Item Details**: Name, quantity, unit price, and line total
- **Receipt ID**: Unique identifier chip on each card

### 5. User Interface
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Mode**: Toggle between light and dark themes
- **Collapsible Sidebar**: Save screen space on mobile
- **Loading Skeletons**: Smooth loading experience
- **Empty States**: Helpful messages when no receipts found
- **Error Handling**: User-friendly error messages with retry capability

### 6. Navigation
- **Header**: Top navigation bar with app title and theme toggle
- **Sidebar**: Collapsible navigation menu with icon + label
- **Active Route**: Visual indication of current page
- **Mobile Drawer**: Temporary drawer on mobile devices

---

## Data Model

### Receipt Type
```typescript
interface Receipt {
    id: number;
    store: string;
    date: string;              // ISO date string
    subtotal: number;
    tax: number;
    total: number;
    createdAt: string;         // ISO timestamp
    receiptItems: ReceiptItem[];
}
```

### Receipt Item Type
```typescript
interface ReceiptItem {
    id: number;
    item: Item;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    createdAt: string;         // ISO timestamp
}

interface Item {
    id: number;
    name: string;
    createdAt: string;
}
```

### API Response Types
```typescript
interface PagedReceiptsResponse {
    receipts: Receipt[];
    monthlyTotals: MonthlyTotal[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
}

interface MonthlyTotal {
    month: string;             // YYYY-MM format
    totalSpent: number;
    receiptCount: number;
}

interface AvailableMonth {
    month: string;             // YYYY-MM format
    label: string;             // Display label (e.g., "January 2025")
}
```

---

## API Endpoints

### Receipt Service
- **GET** `/api/receipts` - Fetch paginated receipts
  - Query Parameters:
    - `page` (number, default: 0)
    - `size` (number, default: 20)
    - `search` (string, optional)
    - `month` (string, YYYY-MM format, optional)
  - Response: `PagedReceiptsResponse`

- **GET** `/api/receipts/available-months` - Get months with receipts
  - Response: `AvailableMonth[]`

---

## Planned Features

### Camera Integration
- **Mobile Camera Access**: Use device camera to capture receipt photos
- **Image Upload**: Direct upload from camera or photo library
- **Preview**: Show image preview before upload
- **Compression**: Optimize images before sending to server

### Receipt Upload
- **File Upload UI**: Drag-and-drop or click to upload
- **Multiple Uploads**: Support batch receipt uploads
- **Upload Progress**: Show upload status and progress
- **n8n Integration**: Trigger workflow on receipt upload

### Mobile Optimizations
- **Touch Gestures**: Swipe actions for quick interactions
- **Offline Support**: Service workers for offline capability
- **PWA Features**: Install as progressive web app
- **Mobile Navigation**: Bottom navigation bar option
- **Camera Optimization**: Fast camera access from home screen

---

## Development Workflow

### Available Scripts
```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Type-check and build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint on codebase
npm run format     # Format code with Prettier
```

### Development Server
- **Host**: localhost
- **Port**: 3000
- **Auto-open**: Browser opens automatically
- **HMR**: Hot Module Replacement enabled

### Build Configuration
- **Path Aliases**: Configured in both Vite and TypeScript
  - `@/` → `./src/`
  - `@components/` → `./src/components/`
  - `@pages/` → `./src/pages/`
  - `@theme/` → `./src/theme/`

### Type Checking
- Strict TypeScript compilation before build
- No type errors allowed in production build

---

## Design Philosophy

### Mobile-First
- Optimized for touch interfaces
- Responsive breakpoints prioritize mobile experience
- Large touch targets (buttons, cards)
- Simplified navigation on small screens

### Material Design
- Follows Material Design 3 principles
- Consistent elevation and shadows
- Smooth transitions and animations
- Accessible color contrasts

### User Experience
- **Fast Loading**: Skeleton loaders during data fetch
- **Smooth Scrolling**: Infinite scroll with intersection observer
- **Intuitive Filters**: Clear search and filter controls
- **Visual Feedback**: Hover effects, active states, loading indicators
- **Error Recovery**: Clear error messages with actionable guidance

### Performance
- **Code Splitting**: Route-based code splitting with React Router
- **Optimized Rendering**: React.memo and useCallback where beneficial
- **Debounced Search**: Reduce unnecessary API calls
- **Pagination**: Load data incrementally to reduce initial load time

---

## Future Roadmap

### Phase 1: Camera & Upload (In Progress)
- [ ] Implement camera access for mobile devices
- [ ] Add file upload component
- [ ] Integrate with n8n workflow
- [ ] Show upload progress and status

### Phase 2: Enhanced Receipt Management
- [ ] Edit receipt details manually
- [ ] Delete receipts
- [ ] Export receipts (CSV, PDF)
- [ ] Receipt categories/tags

### Phase 3: Analytics & Insights
- [ ] Spending trends over time
- [ ] Category-based spending analysis
- [ ] Monthly/yearly reports
- [ ] Budget tracking

### Phase 4: User Features
- [ ] User authentication
- [ ] Multi-user support
- [ ] Sharing receipts
- [ ] Receipt notes and comments

---

## Technical Decisions

### Why Vite?
- Fastest development experience
- Native ES modules support
- Optimized production builds
- Better developer experience than webpack

### Why Material-UI?
- Comprehensive component library
- Built-in accessibility
- Excellent TypeScript support
- Active community and maintenance
- Mobile-optimized components

### Why TypeScript?
- Type safety reduces runtime errors
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring

### Why React Router?
- Industry standard for React routing
- Excellent TypeScript support
- Nested routes and layouts
- Version 6 provides simplified API

---

## Contributing Guidelines

### Code Style
- Follow Prettier configuration (auto-format on save recommended)
- Run `npm run lint` before committing
- Use meaningful variable and function names
- Add comments for complex logic

### Component Creation
- Create new components in appropriate directory
- Define TypeScript interfaces for props
- Export as default export
- Use functional components with hooks

### Commit Messages
- Use conventional commits format
- Examples: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`

---

## Known Issues & Limitations

### Current Limitations
- No user authentication (single-user mode)
- No camera integration yet
- No receipt editing capability
- API URL hardcoded (use environment variable for deployment)
- No offline support
- No receipt deletion

### Browser Compatibility
- Modern browsers only (ES2020+ support required)
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers: iOS Safari 13+, Chrome Android 90+

---

## Environment Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://192.168.178.205:8080
```

### Production Deployment
- Build with `npm run build`
- Serve `dist/` folder with static file server
- Configure API URL via environment variable
- Enable HTTPS for camera access on mobile

---

## License & Credits

**Built With**
- React Team - UI library
- Material-UI Team - Component library
- Vite Team - Build tool
- TypeScript Team - Type system

**Third-Party Dependencies**
See `package.json` for complete dependency list with versions.

---

## Support & Documentation

### Useful Resources
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Documentation](https://reactrouter.com/)

### Project Repository
- **Frontend**: receiptinator-fe
- **Backend**: (n8n workflow + API server)
- **Database**: (Receipt data storage)

---

**Last Updated**: 2025-11-09
**Version**: 1.0.0
**Status**: Active Development
