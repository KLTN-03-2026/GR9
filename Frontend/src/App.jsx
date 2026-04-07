import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Layout from "./components/Layout";
import LandingHome from "./pages/LandingHome";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

import TravelerDashboard from "./pages/Traveler/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import GuideTest from "./pages/Guide/GuideTest";
import BookingSuccess from "./pages/Guest/BookingSuccess";
import ProviderApprovalPage from "./pages/Admin/ProviderApprovalPage";
import UserManagementPage from "./pages/Admin/UserManagementPage";

import ProviderDashboard from "./pages/Provider/ProviderDashboard";
import GuideManagementProvider from "./pages/Provider/GuideManagementProvider";
import ProviderBookingManagement from "./pages/Provider/ProviderBookingManagement";
import GuideLiveTourTracking from "./pages/Guide/GuideLiveTourTracking";
import PublicTourTracking from "./pages/Guest/PublicTourTracking";
import AssignedToursList from "./pages/Guide/AssignedToursList";
import TourTracking from "./pages/Traveler/TourTracking";
import MyBookingTourTraveler from "./pages/Traveler/MyBookingTourTraveler";
import AITravelPlanner from "./pages/Traveler/AITravelPlanner";
import ProviderAndAdminLogin from "./pages/Auth/ProviderAndAdminLogin";
import GuideLogin from "./pages/Auth/GuideLogin";
import ContentModeration from "./pages/Admin/ContentModeration";
import { AuthContextProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";

import TourList from "./pages/Traveler/TourList";
import TourDetail from "./pages/Traveler/TourDetail";
import TravelerPlaceholder from "./pages/Traveler/TravelerPlaceholder";
import HotelManagement from "./pages/Provider/HotelManagement";

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<LandingHome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route
        path="/provider-and-admin-login-management"
        element={<ProviderAndAdminLogin />}
      />
      <Route path="/guide-staff-login" element={<GuideLogin />} />

      <Route path="/traveler" element={<Layout />}>
        <Route path="tour-tracking" element={<TourTracking />} />
        <Route path="my-booking-traveler" element={<MyBookingTourTraveler />} />
        <Route path="ai-travel-planner" element={<AITravelPlanner />} />

        <Route index element={<TravelerDashboard />} />
        <Route path="tour-list" element={<TourList />} />
        <Route path="tour-detail" element={<TourDetail />} />
        <Route path="tour-detail/:tourId" element={<TourDetail />} />
      </Route>

      <Route path="/admin" element={<Layout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="provider-approval" element={<ProviderApprovalPage />} />
        <Route path="content-moderation" element={<ContentModeration />} />
        <Route path="users" element={<UserManagementPage />} />
      </Route>

      <Route path="/provider" element={<Layout />}>
        <Route index element={<ProviderDashboard />} />
        <Route path="guide-management" element={<GuideManagementProvider />} />
        <Route
          path="bookings-management"
          element={<ProviderBookingManagement />}
        />
        <Route path="hotel-management" element={<HotelManagement />} />
      </Route>

      <Route path="/guide" element={<Layout />}>
        <Route index element={<GuideTest />} />
        <Route path="assigned-tours" element={<AssignedToursList />} />
        <Route path="live-tour-tracking" element={<GuideLiveTourTracking />} />
      </Route>

      <Route path="/guest" element={<Layout />}>
        <Route path="public-tour-tracking" element={<PublicTourTracking />} />
        <Route path="booking-success-and-tracking-link" element={<BookingSuccess />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster toastOptions={{ duration: 4000 }} />
      <AuthContextProvider>
        <AppRoutes />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;