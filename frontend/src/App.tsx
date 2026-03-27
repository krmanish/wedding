import { Route, Routes, NavLink } from 'react-router-dom';
import Landing from './pages/Landing';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import WeddingPage from './pages/WeddingPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Wedding Invitation Hub</h1>
        <nav>
          <NavLink to="/">Landing</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/wedding/:slug" element={<WeddingPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
