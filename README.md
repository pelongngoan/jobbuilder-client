# JobBuilder Client

A modern job board application built with React, TypeScript, and Tailwind CSS with full internationalization support.

## Features

- User authentication and authorization
- Job posting and management
- Company profiles
- Job search and filtering
- Resume builder and management
- Admin dashboard
- **Internationalization (i18n)** - English 🇺🇸 and Vietnamese 🇻🇳 support
- Language switching with localStorage persistence
- Dark mode support
- Responsive design

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit
- React Router v6
- Axios
- Tailwind CSS
- Vite
- **react-i18next** - Internationalization framework
- **i18next-browser-languagedetector** - Language detection

## Internationalization (i18n)

This application supports multiple languages with real-time switching:

### Supported Languages

- **English (en)** 🇺🇸 - Default language
- **Vietnamese (vi)** 🇻🇳 - Full translation

### Implementation Status: ✅ **COMPLETED (17/17 pages - 100%)**

All pages have been successfully internationalized:

#### ✅ Completed Pages:

1. **NavBar.tsx** - Navigation with menu and user dropdown
2. **HomePage.tsx** - Main page with job listings
3. **JobCard.tsx** - Job information display component
4. **SaveJobsPage.tsx** - Saved jobs page
5. **JobSearchPage.tsx** - Job search and filtering
6. **JobDetails.tsx** - Complete job detail page
7. **ProfilePage.tsx** - User profile management
8. **ApplicationListPage.tsx** - Application management
9. **CompanyDetail.tsx** - Company profile page
10. **ApplicationApply.tsx** - Job application modal
11. **JobListPage.tsx** - Job listings page
12. **ResumeBuilder.tsx** - Resume creation and editing (complex form)
13. **CompanyList.tsx** - Company directory
14. **ResumeListPage.tsx** - Resume management
15. **ResumeCard.tsx** - Resume display component
16. **JobByCategory.tsx** - Category-based job listings
17. **LanguageDemo.tsx** - Language switching demonstration

### Translation Structure

The translations are organized in the following sections:

- `common` - Shared UI elements (buttons, labels, etc.)
- `navigation` - Menu items and navigation
- `homepage` - Main page content
- `jobCard` - Job listing components
- `jobTypes` - Employment type translations
- `auth` - Authentication forms
- `dashboard` - User dashboard
- `jobs` - Job-related functionality
- `jobSearch` - Search and filtering
- `jobDetails` - Job detail pages
- `profile` - User profile management
- `applications` - Application tracking
- `company` - Company information
- `applicationApply` - Job application process
- `jobList` - Job listing pages
- `resumeBuilder` - Resume creation (50+ keys)
- `companyList` - Company directory
- `resumeList` - Resume management (25+ keys)
- `resumeCard` - Resume display
- `jobByCategory` - Category filtering
- `languageDemo` - Demo functionality

### Usage

The language switcher is available in two variants:

- **Button variant** - Toggle between languages
- **Dropdown variant** - Select from available languages

Language preference is automatically saved to localStorage and restored on page reload.

### Adding New Translations

1. Add new keys to `src-v2/i18n/locales/en.json`
2. Add corresponding Vietnamese translations to `src-v2/i18n/locales/vi.json`
3. Use the `useTranslation` hook in components:

```tsx
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();

  return <h1>{t("mySection.title")}</h1>;
};
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/jobbuilder-client.git
cd jobbuilder-client
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory and add the following variables:

```env
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src-v2/
  ├── assets/        # Static assets
  ├── components/    # Reusable components
  │   ├── common/    # Shared components (LanguageSwitcher, etc.)
  │   ├── layouts/   # Layout components
  │   ├── manager/   # Manager-specific components
  │   └── user/      # User-specific components
  ├── features/      # Feature-specific components
  ├── hooks/         # Custom React hooks
  ├── i18n/          # Internationalization
  │   ├── config.ts  # i18n configuration
  │   └── locales/   # Translation files
  │       ├── en.json # English translations
  │       └── vi.json # Vietnamese translations
  ├── pages/         # Page components
  │   ├── auth/      # Authentication pages
  │   ├── dashboard/ # Dashboard pages
  │   ├── error/     # Error pages
  │   ├── manager/   # Manager pages
  │   └── users/     # User pages
  ├── redux/         # Redux store and slices
  ├── routes/        # Route configuration
  ├── services/      # API services
  ├── styles/        # Global styles
  ├── types/         # TypeScript types
  └── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
