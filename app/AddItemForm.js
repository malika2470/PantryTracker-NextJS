"use client";

import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AddItemForm({ onNewItem }) {
  const [name, setName] = useState('');

  const handleAddItem = async () => {
    if (name.trim()) {
      try {
        const docRef = await addDoc(collection(db, 'pantryItems'), { name });
        const newItem = { id: docRef.id, name };
        setName('');
        onNewItem(newItem); // Optimistically add the new item to the list
      } catch (error) {
        console.error('Error adding document:', error);
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        mt: 2,
        bgcolor: '#333', // Black background
        borderRadius: '8px',
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        label="Item Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '4px' }}
      />
      <Button
        variant="contained"
        sx={{ width: '100%', backgroundColor: '#ff6f00', color: '#fff', '&:hover': { backgroundColor: '#e64a00' } }}
        onClick={handleAddItem}
      >
        Add Item
      </Button>
    </Box>
  );
}
