import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { AuthProvider } from "@/context/auth-context";
import { NotificationProvider } from "@/context/notification-context";
import LoadingFallback from "@/components/loading-fallback";
import RootLayout from "@/components/root-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import React, { Suspense } from "react";
// Loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
  </div>
);

// Lazy-loaded pages with loading fallback
const Home = React.lazy(() => import("./pages/home"));
const Admin = React.lazy(() => import("./pages/admin/layout"));
const AdminDashboard = React.lazy(() => import("./pages/admin/sections/dashboard"));
const RoomManagement = React.lazy(() => import("./pages/admin/sections/rooms"));
const BookingManagement = React.lazy(() => import("./pages/admin/sections/bookings"));
const PaymentManagement = React.lazy(() => import("./pages/admin/sections/payments"));
const UserManagement = React.lazy(() => import("./pages/admin/sections/users"));
// Settings related imports
const SettingsLayout = React.lazy(() => import("./pages/admin/sections/settings-layout"));
const GeneralSettings = React.lazy(() => import("./pages/admin/sections/settings/general"));
const VenueSettings = React.lazy(() => import("./pages/admin/sections/settings/venue"));
const BookingSettings = React.lazy(() => import("./pages/admin/sections/settings/booking"));
const NotificationSettings = React.lazy(() => import("./pages/admin/sections/settings/notifications"));
const Accommodations = React.lazy(() => import("./pages/accommodations"));
const Amenities = React.lazy(() => import("./pages/amenities"));
const VirtualTour = React.lazy(() => import("./pages/virtual-tour-enhanced"));

const Login = React.lazy(() => Promise.resolve({
  default: () => {
    const LoginForm = React.lazy(() => import("@/components/auth/login-form"));
    return (
      <div className="container mx-auto py-10">
        <React.Suspense fallback={<LoadingFallback />}>
          <LoginForm />
        </React.Suspense>
      </div>
    );
  }
}));

const SignUpPage = React.lazy(() => import("@/pages/signup"));

const Contact = React.lazy(() => import("@/pages/contact"));
const About = React.lazy(() => import("@/pages/about"));
const MyBookings = React.lazy(() => import("@/pages/my-bookings"));
const NotFound = React.lazy(() => import("@/pages/not-found"));

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <TooltipProvider>
            <RootLayout>
              <NotificationProvider>
                <Toaster />
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Home route */}
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Navigate to="/" replace />} />
                    
                    {/* Public routes */}
                    <Route path="/accommodations" element={<Accommodations />} />
                    <Route path="/amenities" element={<Amenities />} />
                    <Route path="/virtual-tour" element={<VirtualTour />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={
                      <ErrorBoundary>
                        <Login />
                      </ErrorBoundary>
                    } />
                    <Route path="/signup" element={
                      <ErrorBoundary>
                        <SignUpPage />
                      </ErrorBoundary>
                    } />
                    
                    {/* Protected routes */}
                    <Route path="/my-bookings" element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <MyBookings />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute adminOnly={true}>
                        <ErrorBoundary>
                          <Admin />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }>
                      <Route index element={<AdminDashboard />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="rooms" element={<RoomManagement />} />
                      <Route path="bookings" element={<BookingManagement />} />
                      <Route path="payments" element={<PaymentManagement />} />
                      <Route path="users" element={<UserManagement />} />
                      
                      {/* Settings routes */}
                      <Route path="settings" element={<SettingsLayout />}>
                        <Route index element={<Navigate to="general" replace />} />
                        <Route path="general" element={<GeneralSettings />} />
                        <Route path="venue" element={<VenueSettings />} />
                        <Route path="booking" element={<BookingSettings />} />
                        <Route path="notifications" element={<NotificationSettings />} />
                      </Route>

                      {/* Catch any other admin routes */}
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Route>

                    {/* Not Found route - catch all unmatched routes */}
                    <Route path="*" element={
                      <ErrorBoundary>
                        <NotFound />
                      </ErrorBoundary>
                    } />
                  </Routes>
                </Suspense>
              </NotificationProvider>
            </RootLayout>
          </TooltipProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}