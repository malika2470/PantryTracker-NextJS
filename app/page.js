"use client";

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, TextField, Container } from '@mui/material';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import AddItemForm from './AddItemForm';

export default function Home() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'pantryItems'));
    const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched items:', itemsList);
    setItems(itemsList);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'pantryItems', id));
      fetchItems();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const filteredItems = items.filter(item => 
    item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 105, 180, 0.5)' stroke-width='1' stroke-linecap='round' stroke-linejoin='round' class='feather feather-heart'%3E%3Cpath d='M20.8 4.6c-1.5-1.5-3.9-1.5-5.4 0l-.9.9-.9-.9c-1.5-1.5-3.9-1.5-5.4 0-1.5 1.5-1.5 3.9 0 5.4l6.3 6.3 6.3-6.3c1.5-1.5 1.5-3.9 0-5.4z'%3E%3C/path%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '48px 48px',
        backgroundColor: '#ffe4e6',
      }}
    >
      <Box
        sx={{
          width: '100%',
          bgcolor: 'rgba(255, 255, 255, 0.8)', // Light overlay
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Box sx={{ bgcolor: '#ff9aa2', p: 3, borderRadius: '8px 8px 0 0' }}>
          <Typography variant="h3" color="#fff" sx={{ fontWeight: 'bold' }}>
            Pantry Items
          </Typography>
          <TextField
            label="Search Items"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 2, width: '100%', backgroundColor: '#fff', borderRadius: '4px' }}
          />
        </Box>
        <AddItemForm fetchItems={fetchItems} />
        <Stack spacing={2} overflow="auto" sx={{ maxHeight: '400px', mt: 2 }}>
          {filteredItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: '50px',
                bgcolor: '#fff',
                borderBottom: '1px solid #e0e0e0',
                p: 1,
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h5" color="#333" textAlign="center">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff9aa2', color: '#fff', '&:hover': { backgroundColor: '#ff6f91' } }}
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  );
}
