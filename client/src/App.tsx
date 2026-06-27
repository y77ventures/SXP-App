import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Matches from "./pages/Matches";
import Schedule from "./pages/Schedule";
import Profile from "./pages/Profile";
import CoachDetail from "./pages/CoachDetail";
import PoolDetail from "./pages/PoolDetail";
import Booking from "./pages/Booking";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Wallet from "./pages/Wallet";
import PoolRegistry from "./pages/PoolRegistry";
import JobsBulletin from "./pages/JobsBulletin";
import ShareMyLink from "./pages/ShareMyLink";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import RegionalPools from "./pages/RegionalPools";
import Chat from './pages/Chat';
import CoachOnboarding from './pages/CoachOnboarding';
import RootAdminDashboard from './pages/RootAdminDashboard';
import SwimSchoolDashboard from './pages/SwimSchoolDashboard';
import CoachDashboard from './pages/CoachDashboard';
import PoolHostDashboard from './pages/PoolHostDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import AuthRedirect from './pages/AuthRedirect';
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/matches" component={Matches} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/profile" component={Profile} />
      <Route path="/coach/:id" component={CoachDetail} />
      <Route path="/pool/:id" component={PoolDetail} />
      <Route path="/book" component={Booking} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/faq" component={FAQ} />
      <Route path="/login" component={AuthRedirect} />
      <Route path="/register" component={AuthRedirect} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/pool-registry" component={PoolRegistry} />
      <Route path="/pools/:region" component={RegionalPools} />
      <Route path="/jobs" component={JobsBulletin} />
      <Route path="/share" component={ShareMyLink} />
      <Route path="/chat" component={Chat} />
      <Route path="/chat/:coachId" component={Chat} />
      <Route path="/coach-register" component={CoachOnboarding} />
      <Route path="/root-admin" component={RootAdminDashboard} />
      <Route path="/school-admin" component={SwimSchoolDashboard} />
      <Route path="/coach-dashboard" component={CoachDashboard} />
      <Route path="/pool-host" component={PoolHostDashboard} />
      <Route path="/client-dashboard" component={ClientDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <Router />
          <PWAInstallPrompt />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
