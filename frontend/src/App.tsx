import { Route, Routes } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import WeddingPage from './pages/WeddingPage';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
    },
    secondary: {
      main: '#ffc107',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container component="main" sx={{ flex: 1, py: 4 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/wedding/:slug" element={<WeddingPage />} />
          </Routes>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
