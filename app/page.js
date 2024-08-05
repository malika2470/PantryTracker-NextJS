"use client";

import { useState, useEffect, useCallback } from 'react';
import { Box, Stack, Typography, Button, TextField, Container } from '@mui/material';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import AddItemForm from './AddItemForm';
import CameraCapture from './CameraCapture';

export default function Home() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  const fetchItems = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'pantryItems'));
    const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched items:', itemsList);
    setItems(itemsList);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'pantryItems', id));
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const filteredItems = items.filter(item => 
    item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: 'url("/pantryimage.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          bgcolor: 'rgba(0, 0, 0, 0.7)', // Dark overlay for better contrast
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Box sx={{ bgcolor: '#ff6f00', p: 3, borderRadius: '8px 8px 0 0' }}>
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
        <AddItemForm onNewItem={newItem => setItems(prevItems => [...prevItems, newItem])} />
        <Stack spacing={2} overflow="auto" sx={{ maxHeight: '400px', mt: 2 }}>
          {filteredItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: '50px',
                bgcolor: '#333',
                borderBottom: '1px solid #e0e0e0',
                p: 1,
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h5" color="#fff" textAlign="center">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff6f00', color: '#fff', '&:hover': { backgroundColor: '#e64a00' } }}
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Stack>
        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: '#ff6f00', '&:hover': { backgroundColor: '#e64a00' } }}
          onClick={() => setShowCamera(!showCamera)}
        >
          {showCamera ? "Hide Camera" : "Show Camera"}
        </Button>
      </Box>
      {showCamera && <CameraCapture />}
    </Container>
  );
}
