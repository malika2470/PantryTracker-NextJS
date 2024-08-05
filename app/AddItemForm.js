"use client";

import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AddItemForm({ fetchItems }) {
  const [name, setName] = useState('');

  const handleAddItem = async () => {
    if (name.trim()) {
      try {
        await addDoc(collection(db, 'pantryItems'), { name });
        setName('');
        fetchItems();
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
        bgcolor: '#ffe4e6', // Light pink background
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
        sx={{ width: '100%', backgroundColor: '#ff9aa2', color: '#fff', '&:hover': { backgroundColor: '#ff6f91' } }}
        onClick={handleAddItem}
      >
        Add Item
      </Button>
    </Box>
  );
}









