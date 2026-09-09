# Diplomatic Dictionary

A comprehensive TypeScript-based web application for browsing and searching diplomatic terms and concepts used in international relations and foreign affairs.

## 📄 Legal & compliance

Before deploying, read:

- `docs/LEGAL-RISK-REPORT.ru.md` — compliance status, open legal questions and the
  checklist for the legal department.
- `docs/IMAGE-CREDITS.md` — image provenance register.
- `src/constants/organization.ts` — organisation details. Fields marked `TODO`
  are shown on the site until real data is filled in.

Legal documents live in `src/constants/legalDocs.ts` (Uzbek + Russian) and are
rendered by `src/components/legal/LegalDocumentView.tsx` at `/privacy`, `/terms`,
`/cookies` and `/refund`.

Analytics (`ConsentedAnalytics`) and reCAPTCHA are **not** loaded until the user
consents / starts using the contact form. Do not move these scripts back into the
root layout.

## 🚀 Features

- **Bilingual interface**: Uzbek and Russian (no English UI at the moment)
- **Uzbek alphabetical order**: dictionary sorting follows the official Uzbek
  Latin alphabet, including the Oʻ, Gʻ, Sh, Ch, Ng digraphs
  (`src/lib/uzbekCollation.ts`)
- **Advanced Search**: Real-time search with debounced input
- **Category Filtering**: Filter terms by categories
- **Responsive Design**: Modern UI that works on all devices
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Type Safety**: Full TypeScript implementation with strict typing
- **Performance**: Optimized with React hooks and memoization

## 🛠️ Technical Improvements

### Complete TypeScript Migration

- Converted all JavaScript files to TypeScript
- Added comprehensive type definitions
- Implemented strict TypeScript configuration
- Added proper type checking and validation

### Enhanced API Layer

- Robust error handling with custom error classes
- Automatic token refresh mechanism
- Request/response interceptors
- Retry logic for failed requests
- Proper HTTP status code handling

### Modern React Patterns

- Custom hooks for state management
- Error boundaries for graceful error handling
- Memoized components for performance
- Proper component composition

### Improved User Experience

- Loading states with spinners
- Error states with retry functionality
- Debounced search for better performance
- Responsive design with Tailwind CSS
- Accessibility improvements

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dictionary/        # Dictionary pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── dictionary/       # Dictionary-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API
├── types/                # TypeScript type definitions
└── globals.css           # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd diplomatic-dictionary
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://your-api-url:8000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### TypeScript Configuration

The project uses strict TypeScript configuration with:

- Strict mode enabled
- Path mapping for clean imports
- Next.js TypeScript plugin
- Proper module resolution

### API Configuration

- Environment-based API URL configuration
- Automatic token management
- Request/response interceptors
- Error handling and retry logic

## 🎨 UI Components

### Base Components

- `LoadingSpinner` - Reusable loading indicator
- `ErrorBoundary` - Error boundary wrapper
- `SearchBar` - Debounced search input
- `CategoryFilter` - Category selection dropdown
- `LanguageSelector` - Language switching buttons
- `TermCard` - Term display card

### Custom Hooks

- `useDictionary` - Dictionary data management
- Error handling and loading states
- Search and filtering logic
- Data validation

## 🔒 Security Features

- Token-based authentication
- Automatic token refresh
- Secure token storage
- Input validation and sanitization
- XSS protection

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🧪 Error Handling

- Comprehensive error boundaries
- User-friendly error messages
- Retry mechanisms
- Fallback UI components
- Detailed error logging

## 🔄 State Management

- React hooks for local state
- Custom hooks for complex logic
- Proper state synchronization
- Optimistic updates
- Error state management

## 📊 Performance Optimizations

- Memoized components
- Debounced search
- Lazy loading
- Optimized re-renders
- Efficient data fetching

## 🌐 Internationalization

- Two locales: `uz` (default) and `ru`, stored in the `language` cookie
- All UI strings live in `src/constants/translations.ts`; legal documents in
  `src/constants/legalDocs.ts`
- The language switcher in the header is currently commented out, so only the
  Uzbek UI is reachable in production — enable it or drop the unused translations
- No RTL locales are used

## 🔧 Development

### Code Quality

- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Component documentation

### Testing

No automated test suite is set up yet. Before changing dictionary sorting,
verify `src/lib/uzbekCollation.ts` manually: `Oʻ`, `Gʻ`, `Sh`, `Ch`, `Ng` must
come after `Z`, and all apostrophe variants (`ʻ ' ' \``) must be treated as one
character.

## 📈 Future Enhancements

- [ ] User authentication system
- [ ] Admin panel for content management
- [ ] Offline support with PWA
- [ ] Advanced search filters
- [ ] Export functionality
- [ ] User favorites and bookmarks
- [ ] Social sharing features
- [ ] Analytics and usage tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.
