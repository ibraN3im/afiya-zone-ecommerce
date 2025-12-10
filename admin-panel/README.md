# Afiya Zone Admin Panel

This is a standalone admin panel for managing the Afiya Zone e-commerce platform.

## Features

- User management (customers and admins)
- Product management (CRUD operations)
- Order management and tracking
- Invoice generation and preview
- Real-time statistics dashboard

## Changes Made

### Currency Conversion
All prices have been converted from USD ($) to UAE Dirham (AED):
- Product prices are now displayed as "AED {amount}"
- Order totals are displayed as "AED {amount}"
- Invoice amounts are shown in AED

### UI/UX Improvements
- Modern, clean interface with consistent styling
- Improved form layouts and input fields
- Better responsive design for all screen sizes
- Enhanced table designs with hover states
- Consistent color scheme and typography
- Improved loading states and transitions

### Technical Improvements
- Added transition effects for better user experience
- Improved accessibility with proper focus states
- Enhanced form validation
- Better error handling
- Optimized build configuration

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Radix UI for accessible components
- Lucide React for icons
- Sonner for notifications
- Vite for development and build tooling

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## API Integration

The admin panel connects to the main Afiya Zone backend API running on `http://localhost:5000`.
All API calls are proxied through `/api` endpoint.

## Environment

- Development server runs on port 3001
- Backend API expected on port 5000