import { Box, Card, CardContent } from '@mui/material';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f8e9',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 2, boxShadow: 3 }}>
        <CardContent>{children}</CardContent> {/* ВАЖНО: здесь рендерятся дети */}
      </Card>
    </Box>
  );
}