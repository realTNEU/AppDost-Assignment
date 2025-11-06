import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useState } from 'react'
import Navbar from './components/Navbar';
import AuthPage from './pages/Authpage';
import LandingPage from './pages/LandingPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <div className="min-h-screen bg-[#0f0a19] text-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
