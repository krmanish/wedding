import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  Divider,
} from '@mui/material';

interface WeddingForm { couple_name: string; slug: string; theme: string; venue: string; description: string; }
interface GuestForm { name: string; mobile: string; }

export default function AdminDashboard() {
  const [weddingForm, setWeddingForm] = useState<WeddingForm>({ couple_name: '', slug: '', theme: '', venue: '', description: '' });
  const [guestForm, setGuestForm] = useState<GuestForm>({ name: '', mobile: '' });
  const [weddings, setWeddings] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => { fetchWeddings(); }, []);

  const fetchWeddings = async () => {
    const res = await axios.get('http://localhost:8000/weddings');
    setWeddings(res.data);
  };

  const createWedding = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/admin/weddings', weddingForm);
    setWeddingForm({ couple_name: '', slug: '', theme: '', venue: '', description: '' });
    await fetchWeddings();
  };

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    await axios.post(`http://localhost:8000/admin/weddings/${selectedId}/guests`, guestForm);
    setGuestForm({ name: '', mobile: '' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 4, color: '#d32f2f' }}>
        Admin Dashboard
      </Typography>

      {/* Create Wedding Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Create Wedding Page
        </Typography>
        <form onSubmit={createWedding}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <TextField
              label="Couple Name"
              placeholder="Couple name"
              value={weddingForm.couple_name}
              onChange={(e) => setWeddingForm({ ...weddingForm, couple_name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Slug"
              placeholder="Slug"
              value={weddingForm.slug}
              onChange={(e) => setWeddingForm({ ...weddingForm, slug: e.target.value })}
              fullWidth
            />
            <TextField
              label="Theme"
              placeholder="Theme"
              value={weddingForm.theme}
              onChange={(e) => setWeddingForm({ ...weddingForm, theme: e.target.value })}
              fullWidth
            />
            <TextField
              label="Venue"
              placeholder="Venue"
              value={weddingForm.venue}
              onChange={(e) => setWeddingForm({ ...weddingForm, venue: e.target.value })}
              fullWidth
            />
          </Box>
          <TextField
            label="Description"
            placeholder="Description"
            value={weddingForm.description}
            onChange={(e) => setWeddingForm({ ...weddingForm, description: e.target.value })}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#d32f2f',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
            }}
          >
            Create Wedding
          </Button>
        </form>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* Weddings List and Guest Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Current Weddings */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Current Weddings
          </Typography>
          <List>
            {weddings.map((w) => (
              <ListItemButton
                key={w.id}
                onClick={() => setSelectedId(w.id)}
                selected={selectedId === w.id}
                sx={{
                  backgroundColor: selectedId === w.id ? '#f5f5f5' : 'transparent',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={w.couple_name}
                  secondary={`Slug: ${w.slug}`}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* Add Guest Section */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Add Guest
          </Typography>
          {selectedId ? (
            <Card sx={{ backgroundColor: '#e8f5e9', mb: 2 }}>
              <CardContent>
                <Typography color="success.dark" variant="body2">
                  ✓ Adding guest to wedding ID {selectedId}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ backgroundColor: '#fff3e0', mb: 2 }}>
              <CardContent>
                <Typography color="warning.dark" variant="body2">
                  Select a wedding from the list to add guests
                </Typography>
              </CardContent>
            </Card>
          )}
          <form onSubmit={addGuest}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Guest Name"
                placeholder="Name"
                value={guestForm.name}
                onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                fullWidth
                disabled={!selectedId}
              />
              <TextField
                label="Mobile"
                placeholder="Mobile"
                value={guestForm.mobile}
                onChange={(e) => setGuestForm({ ...guestForm, mobile: e.target.value })}
                fullWidth
                disabled={!selectedId}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!selectedId}
                sx={{
                  backgroundColor: '#d32f2f',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#b71c1c',
                  },
                }}
              >
                Add Guest
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
