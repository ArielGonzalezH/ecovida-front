import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, Box, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ProductItem = ({ product }) => {
  return (
    <>
      <ListItem sx={{ bgcolor: 'background.paper', my: 1, borderRadius: 2 }}>
        <ListItemText
          primary={<Typography variant="h6" sx={{ color: 'primary.main' }}>{product.name}</Typography>}
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary">Precio: ${product.price}</Typography>
              <Typography variant="body2" color="text.secondary">Stock: {product.stock}</Typography>
              <Typography variant="body2" color="text.secondary">Fecha de Caducidad: {product.expiryDate}</Typography>
            </Box>
          }
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="edit" sx={{ color: 'secondary.main' }}>
            <Edit />
          </IconButton>
          <IconButton edge="end" aria-label="delete" sx={{ color: 'error.main' }}>
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

export default ProductItem;
