import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Chatbot from '../Chatbot';

/**
 * UserLayout Component
 * 
 * A wrapper component that provides the standard layout for most pages.
 * It includes the Topbar (navigation), the main content area (<Outlet />), 
 * the Footer, and the floating Chatbot.
 */
const UserLayout = () => {
  return (
    <div className="app-layout">
      <div className="main-container">
        {/* Navigation bar shown at the top of the page */}
        <Navbar />
        
        {/* <Outlet /> is a placeholder from React Router. 
            It renders whatever page component matches the current URL. */}
        <main className="main-content">
          <Outlet />
        </main>
        
        {/* Footer shown at the bottom of the page */}
        <Footer />
        
        {/* Floating AI Assistant Chatbot */}
        <Chatbot />
      </div>
    </div>
  );
};

export default UserLayout;
