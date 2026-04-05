import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Login, Register, AdminLogin, AdminDashboard, ContentManagement, About, Dashboard, Requests, NewRequest, RequestDetail, PublicProfile, Profile, Notifications, MyDonations, MyRequests, FindDonors, UserManagement } from './pages';
import Campaigns from './pages/Campaigns';
import Impact from './pages/Impact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/requests/new" element={<NewRequest />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
            <Route path="/users/:id" element={<PublicProfile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/my-donations" element={<MyDonations />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/find-donors" element={<FindDonors />} />
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/content" element={<ContentManagement />} />
            
            <Route path="/users" element={<UserManagement />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
