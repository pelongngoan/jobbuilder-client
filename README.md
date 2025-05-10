# JobBuilder Client

A modern job board application built with React, TypeScript, and Tailwind CSS.

## Features

- User authentication and authorization
- Job posting and management
- Company profiles
- Job search and filtering
- Resume builder and management
- Admin dashboard
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
src/
  ├── assets/        # Static assets
  ├── components/    # Reusable components
  │   ├── admin/     # Admin-specific components
  │   ├── company/   # Company-specific components
  │   ├── home/      # Home page components
  │   ├── hr/        # HR-specific components
  │   ├── layout/    # Layout components
  │   ├── shared/    # Shared components
  │   └── ui/        # UI components
  ├── features/      # Feature-specific components
  ├── layout/        # Layout components
  ├── lib/           # Utilities and services
  │   └── api/       # API services
  ├── pages/         # Page components
  ├── routes/        # Route configuration
  ├── store/         # Redux store
  ├── styles/        # Global styles
  └── types/         # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
