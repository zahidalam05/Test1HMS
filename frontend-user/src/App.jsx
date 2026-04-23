import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Hostel from './pages/Hostel';
import FeePayment from './pages/FeePayment';
import Complaints from './pages/Complaints';
import Notices from './pages/Notices';
import Mess from './pages/Mess';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/hostel" element={<Hostel />} />
              <Route path="/fees" element={<FeePayment />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/mess" element={<Mess />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
