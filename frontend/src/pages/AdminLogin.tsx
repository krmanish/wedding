import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from '@mui/material';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/admin/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: '#d32f2f', textAlign: 'center' }}>
          Admin Login
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: 'textSecondary' }}>
          Sign in to manage wedding pages and guests
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#d32f2f',
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#b71c1c',
                },
              }}
            >
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
