import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#d32f2f' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          💍 Wedding Invitation Hub
        </Typography>
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <Button color="inherit" sx={{ fontSize: '1rem' }}>
            Home
          </Button>
        </NavLink>
        <NavLink to="/admin" style={{ textDecoration: 'none' }}>
          <Button color="inherit" sx={{ fontSize: '1rem' }}>
            Admin
          </Button>
        </NavLink>
      </Toolbar>
    </AppBar>
  );
}
