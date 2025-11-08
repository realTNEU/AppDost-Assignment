import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AuthPage from './pages/Authpage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import FeedPage from './pages/FeedPage';
import UserProfilePage from './pages/UserProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/user/:userId" element={<UserProfilePage />} />
          </Routes>
        </AppLayout>
      </Router>
  )
}

export default App
