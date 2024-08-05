import { Box, Stack, Typography } from '@mui/material';

const items = ['tomato', 'potato', 'onion', 'garlic', 'carrot', 'lettuce', 'kale', 'cucumber'];

export default function Home() {
  return (
    <Box
      sx={{
        width: '800px',
        height: 'auto',
        bgcolor: '#fff',
        border: 1,
        borderColor: 'grey.300',
        borderRadius: '4px',
        overflow: 'hidden',
        mx: 'auto',
        my: 4,
      }}
    >
      <Box sx={{ bgcolor: '#ADD8E6', p: 2, textAlign: 'center' }}>
        <Typography variant="h2" color="#333">
          Pantry Items
        </Typography>
      </Box>
      <Stack spacing={2} overflow="auto" sx={{ maxHeight: '500px' }}>
        {items.map((item) => (
          <Box
            key={item}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50px',
              bgcolor: '#fff',
              borderBottom: 1,
              borderColor: 'grey.300'
            }}
          >
            <Typography variant="h4" color="#333" textAlign="center">
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
