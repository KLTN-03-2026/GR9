import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Layout from "./components/Layout";
import LandingHome from "./pages/LandingHome";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import VerifyEmailOtpPage from "./pages/Auth/VerifyEmailOtpPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import VerifyResetPasswordOtpPage from "./pages/Auth/VerifyResetPasswordOtpPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import FirstJoinPasswordPage from "./pages/Auth/FirstJoinPasswordPage";

import TravelerDashboard from "./pages/Traveler/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import BookingSuccess from "./pages/Guest/BookingSuccess";
import ProviderApprovalPage from "./pages/Admin/ProviderApprovalPage";
import ProviderApprovalHistory from "./pages/Admin/ProviderApprovalHistory";
import UserManagementPage from "./pages/Admin/UserManagementPage";

import ProviderDashboard from "./pages/Provider/ProviderDashboard";
import ManageTours from "./pages/Provider/ManageTours";
import EditTour from "./pages/Provider/EditTour";
import GuideManagementProvider from "./pages/Provider/GuideManagementProvider";
import ServiceManagement from "./pages/Provider/ServiceManagement";
import ProviderBookingManagement from "./pages/Provider/ProviderBookingManagement";
import GuideLiveTourTracking from "./pages/Guide/GuideLiveTourTracking";
import PublicTourTracking from "./pages/Guest/PublicTourTracking";
import AssignedToursList from "./pages/Guide/AssignedToursList";
import TourTracking from "./pages/Traveler/TourTracking";
import MyBookingTourTraveler from "./pages/Traveler/MyBookingTourTraveler";
import TrackingLinkManagement from "./pages/Traveler/TrackingLinkManagement";
import AITravelPlanner from "./pages/Traveler/AITravelPlanner";
import AITourHistory from "./pages/Traveler/AITourHistory";
import ProviderAndAdminLogin from "./pages/Auth/ProviderAndAdminLogin";
import GuideLogin from "./pages/Auth/GuideLogin";
import { AuthContextProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";

import TourList from "./pages/Traveler/TourList";
import TourDetail from "./pages/Traveler/TourDetail";
import GuideDashboardHome from "./pages/Guide/GuideDashboardHome";
import ProviderProfile from "./pages/Provider/ProviderProfile";
import ProviderApplicationForm from "./pages/Guest/ProviderApplicationForm";
import ProviderApplicationForm from "./pages/LandingHome/ProviderApplicationForm";
import TravelerProfile from "./pages/Traveler/TravelerProfile";
import GuideProfile from "./pages/Guide/GuideProfile";
import AdminProfile from "./pages/Admin/AdminProfile";
import TourSchedulePage from "./pages/Provider/TourSchedule";
function AppRoutes() {
    const location = useLocation();

    return (
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingHome />} />
            <Route path="/apply-provider" element={<ProviderApplicationForm />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/verify-email-otp" element={<VerifyEmailOtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/forgot-password/verify-otp" element={<VerifyResetPasswordOtpPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/first-join-password" element={<FirstJoinPasswordPage />} />
            <Route path="/provider-login" element={<ProviderAndAdminLogin />} />
            <Route path="/admin-login" element={<ProviderAndAdminLogin />} />
            <Route path="/guide-staff-login" element={<GuideLogin />} />

            <Route path="/traveler" element={<Layout />}>
                <Route path="profile" element={<TravelerProfile />} />
                <Route path="tour-tracking" element={<TourTracking />} />
                <Route path="my-booking-traveler" element={<MyBookingTourTraveler />} />
                <Route path="traveler-tracking-link-management" element={<TrackingLinkManagement />} />
                <Route path="ai-travel-planner" element={<AITravelPlanner />} />
                <Route path="ai-tour-history" element={<AITourHistory />} />

                <Route index element={<TravelerDashboard />} />
                <Route path="tour-list" element={<TourList />} />
                <Route path="tour-detail" element={<TourDetail />} />
                <Route path="tour-detail/:tourId" element={<TourDetail />} />
            </Route>

            <Route path="/admin" element={<Layout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="provider-approval" element={<ProviderApprovalPage />} />
                <Route path="provider-approval-history" element={<ProviderApprovalHistory />} />
                <Route path="users" element={<UserManagementPage />} />
            </Route>

            <Route path="/provider" element={<Layout />}>
                <Route index element={<ProviderDashboard />} />
                <Route path="manage-tours" element={<ManageTours />} />
                <Route path="tours/:id/schedule" element={<TourSchedulePage />} />
                <Route path="edit-tour" element={<EditTour />} />
                <Route path="guide-management" element={<GuideManagementProvider />} />
                <Route path="bookings-management" element={<ProviderBookingManagement />} />
                <Route path="service-management" element={<ServiceManagement />} />
                <Route path="profile" element={<ProviderProfile />} />
            </Route>

            <Route path="/guide" element={<Layout />}>
                <Route index element={<GuideDashboardHome />} />
                <Route path="profile" element={<GuideProfile />} />
                <Route path="assigned-tours" element={<AssignedToursList />} />
                <Route path="live-tour-tracking" element={<GuideLiveTourTracking />} />
            </Route>

            <Route path="/guest" element={<Layout />}>
                <Route index element={<PublicTourTracking />} />
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
