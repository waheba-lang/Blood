import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Import all our page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import Profile from './pages/Profile';
import MyDonations from './pages/MyDonations';
import FindDonors from './pages/FindDonors';
import UserManagement from './pages/UserManagement';
import PrintDonation from './pages/PrintDonation';
import Statistics from './pages/Statistics';
import Campaigns from './pages/Campaigns';
import About from './pages/About';
import OrganizerDashboard from './pages/OrganizerDashboard';
import PrintCertificate from './pages/PrintCertificate';

// Import our layout components (Wrappers that provide a consistent UI, like Topbar/Footer)
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/AdminLayout';

// Import route guards (Components that check if a user is allowed to visit a page)
import AdminRoute from './components/guards/AdminRoute';
import UserRoute from './components/guards/UserRoute';
import GuestRoute from './components/guards/GuestRoute';
import PublicUserRoute from './components/guards/PublicUserRoute';
import OrganizerRoute from './components/guards/OrganizerRoute';

import './App.css';

/**
 * ScrollHandler Component
 * 
 * This is a utility component that runs every time the URL path changes.
 * 1. It scrolls the window back to the top of the page.
 * 2. It sets up an IntersectionObserver to add an 'active' class to elements 
 *    with the 'reveal' class when they scroll into view (used for fade-in animations).
 */
function ScrollHandler() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top when the route changes
    window.scrollTo(0, 0);

    // Setup intersection observer for scroll animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    // Watch all elements that have the '.reveal' class
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Cleanup function when component unmounts
    return () => observer.disconnect();
  }, [pathname]);

  return null; // This component doesn't render anything visible
}

/**
 * App Component
 * 
 * The main entry point for the React application. 
 * It handles all the routing (mapping URLs to specific page components).
 */
function App() {
  return (
    <Router>
      {/* Handles scrolling behavior when changing pages */}
      <ScrollHandler />

      <Routes>
        {/* Guest Routes: Pages only accessible to logged-out users */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin Routes: Pages specifically for administrators */}
        <Route path="/admin">
          {/* The actual admin dashboard, requires admin privileges */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="operations" element={<Dashboard />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Route>
        </Route>
        
        {/* Legacy route redirect: automatically send /users to /admin/users */}
        <Route path="/users" element={<Navigate to="/admin/users" replace />} />

        {/* User Routes: Pages wrapped inside the standard user layout (Topbar + Footer) */}
        <Route element={<UserLayout />}>
          
          {/* Public Routes: Anyone can visit these, logged in or not */}
          <Route element={<PublicUserRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/users/:id" element={<PublicProfile />} />
          </Route>

          {/* Protected Routes: Only logged-in standard users can visit these */}
          <Route element={<UserRoute />}>
            <Route path="/find-donors" element={<FindDonors />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/certificate" element={<PrintCertificate />} />
            <Route path="/my-donations" element={<MyDonations />} />
            <Route path="/donations/:id/print" element={<PrintDonation />} />
          </Route>

          {/* Organizer Routes: Only event organizers can access these */}
          <Route element={<OrganizerRoute />}>
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
