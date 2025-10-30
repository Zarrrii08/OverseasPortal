# Linguist Portal - Project Structure

## Overview
This document outlines the project structure for the Linguist Portal application, making it easy to understand and maintain.

## Directory Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx           # Main sidebar navigation component
│   │   ├── Header.jsx            # Top header with search and user profile
│   │   └── DashboardLayout.jsx   # Main layout wrapper for all dashboard pages
│   │
│   ├── dashboard/
│   │   ├── BookingCard.jsx       # Reusable booking statistics card
│   │   └── WelcomeBanner.jsx     # Welcome banner with user name
│   │
│   ├── LoginForm/
│   │   └── LoginForm.jsx         # Login form component
│   │
│   └── ProtectedRoute.jsx        # Route protection wrapper
│
├── pages/
│   ├── Login.jsx                 # Login page
│   ├── DashboardPage.jsx         # Main dashboard with booking cards
│   ├── BookingsPage.jsx          # Bookings management (Coming Soon)
│   ├── OnDemandCallsPage.jsx    # On-demand calls (Coming Soon)
│   ├── FinancePage.jsx           # Finance reports (Coming Soon)
│   ├── UsefulLinksPage.jsx       # Useful links & training (Coming Soon)
│   ├── CPDCoursePage.jsx         # CPD courses (Coming Soon)
│   ├── PoliciesPage.jsx          # Policies & procedures (Coming Soon)
│   ├── ProfilePage.jsx           # User profile & settings (Coming Soon)
│   ├── ScreeningPage.jsx         # Screening & vetting (Coming Soon)
│   ├── EnquiriesPage.jsx         # Enquiries & feedback (Coming Soon)
│   └── SystemUpdatesPage.jsx    # System updates (Coming Soon)
│
├── context/
│   └── AuthContext.jsx           # Authentication context provider
│
├── services/
│   └── [API services]            # API integration services
│
├── app.jsx                       # Main app component with routes
└── main.jsx                      # Application entry point
```

## Component Architecture

### Layout Components

#### **DashboardLayout**
- Main wrapper for all authenticated pages
- Manages sidebar state (open/closed)
- Contains Header and Sidebar components
- Provides consistent layout across all pages

#### **Sidebar**
- Navigation menu with all app sections
- Responsive design (mobile drawer, desktop fixed)
- Active route highlighting
- Icons from lucide-react

#### **Header**
- Search functionality
- User profile dropdown
- Logout functionality
- Mobile menu toggle

### Dashboard Components

#### **WelcomeBanner**
- Personalized greeting with user name
- Illustrative design matching the screenshot
- Responsive layout

#### **BookingCard**
- Reusable card for displaying booking statistics
- Props: title, count, description, icon, color
- Gradient icon backgrounds

## Routes

All routes are protected except `/loginpage`:

| Route | Component | Status |
|-------|-----------|--------|
| `/loginpage` | LoginPage | ✅ Active |
| `/dashboard` | DashboardPage | ✅ Active |
| `/bookings` | BookingsPage | 🚧 Coming Soon |
| `/on-demand-calls` | OnDemandCallsPage | 🚧 Coming Soon |
| `/finance` | FinancePage | 🚧 Coming Soon |
| `/useful-links` | UsefulLinksPage | 🚧 Coming Soon |
| `/cpd-course` | CPDCoursePage | 🚧 Coming Soon |
| `/policies` | PoliciesPage | 🚧 Coming Soon |
| `/profile` | ProfilePage | 🚧 Coming Soon |
| `/screening` | ScreeningPage | 🚧 Coming Soon |
| `/enquiries` | EnquiriesPage | 🚧 Coming Soon |
| `/system-updates` | SystemUpdatesPage | 🚧 Coming Soon |

## API Integration Guide

### Dashboard Statistics

To integrate booking statistics API, update `DashboardPage.jsx`:

```javascript
// Replace mock data with API call
useEffect(() => {
  async function fetchBookingStats() {
    const response = await api.get('/bookings/stats');
    setBookingStats(response.data);
  }
  fetchBookingStats();
}, []);
```

### User Data

User information is available through the `useAuth()` hook:

```javascript
const { user } = useAuth();
// user.name, user.username, user.email, etc.
```

## Styling

- **Framework**: TailwindCSS
- **Icons**: lucide-react
- **Components**: Custom components with Radix UI primitives
- **Color Scheme**: Blue primary (#2563eb), with accent colors for different sections

## Key Features

1. **Responsive Design**: Mobile-first approach with drawer navigation on mobile
2. **Protected Routes**: All dashboard routes require authentication
3. **Modular Structure**: Easy to add new pages and components
4. **Ready for API Integration**: All pages structured to accept data from APIs
5. **Consistent Layout**: DashboardLayout ensures uniform appearance

## Adding New Pages

1. Create page component in `src/pages/`
2. Import in `src/app.jsx`
3. Add route in the Routes section
4. Add menu item in `src/components/layout/Sidebar.jsx`

Example:
```javascript
// 1. Create NewPage.jsx
export default function NewPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Your content */}
      </div>
    </DashboardLayout>
  );
}

// 2. Add route in app.jsx
<Route
  path="/new-page"
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  }
/>

// 3. Add to Sidebar menuItems array
{ id: 'new-page', label: 'New Page', icon: IconName, path: '/new-page' }
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Notes

- All "Coming Soon" pages have the same structure for consistency
- Each page is ready to receive data from API endpoints
- The dashboard displays mock data that can be easily replaced with real API calls
- User authentication is handled through AuthContext
