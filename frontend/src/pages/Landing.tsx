import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import {
  CardGiftcard,
  People,
  PhotoAlbum,
  CheckCircle,
} from '@mui/icons-material';

export default function Landing() {
  const features = [
    {
      icon: <CardGiftcard sx={{ fontSize: 40, color: '#d32f2f' }} />,
      title: 'Gift Management',
      description: 'Guests can share blessing tokens and gifts with ease',
    },
    {
      icon: <People sx={{ fontSize: 40, color: '#d32f2f' }} />,
      title: 'Guest Management',
      description: 'Easily manage invites and guest RSVP responses',
    },
    {
      icon: <PhotoAlbum sx={{ fontSize: 40, color: '#d32f2f' }} />,
      title: 'Photo Sharing',
      description: 'Guests can upload and share photos from the event',
    },
    {
      icon: <CheckCircle sx={{ fontSize: 40, color: '#d32f2f' }} />,
      title: 'Comments & Moderation',
      description: 'Enable guest comments with built-in moderation',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #ffc107 100%)',
          color: 'white',
          py: 8,
          mb: 4,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          💍 Welcome to Your Wedding Invite Portal
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, fontSize: '1.2rem' }}>
          Create custom wedding pages, send invite links, and let guests share blessing tokens
        </Typography>
        <Button
          component={RouterLink}
          to="/admin"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: 'white',
            color: '#d32f2f',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Go to Admin Login
        </Button>
      </Box>

      {/* How It Works */}
      <Container maxWidth="md" sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          How It Works
        </Typography>
        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f9f9f9' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ color: '#d32f2f', mr: 2, fontSize: 30 }} />
              <Typography>Admin creates wedding pages and adds invited guest mobile numbers</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ color: '#d32f2f', mr: 2, fontSize: 30 }} />
              <Typography>Guests can login with mobile + OTP and RSVP</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
              <CheckCircle sx={{ color: '#d32f2f', mr: 2, fontSize: 30 }} />
              <Typography>Comments with moderation, gifts, photo uploads - all in one place</Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Features
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
                <CardContent sx={{ textAlign: 'center', flex: 1 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: '#f5f5f5',
          py: 6,
          borderRadius: 2,
          textAlign: 'center',
          mt: 6,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Ready to Create Your Ideal Wedding Portal?
        </Typography>
        <Button
          component={RouterLink}
          to="/admin"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#d32f2f',
            color: 'white',
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
          }}
        >
          Get Started Now
        </Button>
      </Box>
    </Box>
  );
}
