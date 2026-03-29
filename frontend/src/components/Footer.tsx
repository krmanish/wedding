import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: '#f5f5f5', py: 3, mt: 4, textAlign: 'center' }}>
      <Typography variant="body2" color="textSecondary">
        © 2024 Wedding Invitation Hub. All rights reserved.
      </Typography>
    </Box>
  );
}
