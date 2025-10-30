import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import { Outlet } from "react-router-dom";

// Eager load Login page (needed immediately)
import LoginPage from "./pages/Login";

// Lazy load all dashboard pages (loaded on demand)
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const BookingsPage = lazy(() => import("./pages/BookingsPage"));
// const OnDemandCallsPage = lazy(() => import("./pages/OnDemandCallsPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const UsefulLinksPage = lazy(() => import("./pages/UsefulLinksPage"));
const CPDCoursePage = lazy(() => import("./pages/CPDCoursePage"));
const PoliciesPage = lazy(() => import("./pages/PoliciesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ScreeningPage = lazy(() => import("./pages/ScreeningPage"));
const EnquiriesPage = lazy(() => import("./pages/EnquiriesPage"));
const SystemUpdatesPage = lazy(() => import("./pages/SystemUpdatesPage"));

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/loginpage" element={<LoginPage />} />

          {/* Protected routes share a single DashboardLayout so Sidebar/Header mount once */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </ProtectedRoute>
            }>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            {/* <Route path="/on-demand-calls" element={<OnDemandCallsPage />} /> */}
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/useful-links" element={<UsefulLinksPage />} />
            <Route path="/cpd-course" element={<CPDCoursePage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/screening" element={<ScreeningPage />} />
            <Route path="/enquiries" element={<EnquiriesPage />} />
            <Route path="/system-updates" element={<SystemUpdatesPage />} />
          </Route>

          {/* Legacy route redirect */}
          <Route
            path="/dashboardpage"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route path="/" element={<Navigate to="/loginpage" replace />} />
          {/* Catch-all route: redirect any unknown path to loginpage */}
          <Route path="*" element={<Navigate to="/loginpage" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
