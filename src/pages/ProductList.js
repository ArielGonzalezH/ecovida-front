import React, { useState } from 'react';
import { List, Container, Button, Box, Typography, Paper } from '@mui/material';
import ProductItem from '../components/ProductItem';
import AddProductDialog from '../components/AddProductDialog';

const initialProducts = [
  {
    id: 1,
    name: 'Producto 1',
    price: 100,
    stock: 10,
    expiryDate: '2024-12-31'
  },
  {
    id: 2,
    name: 'Producto 2',
    price: 200,
    stock: 5,
    expiryDate: '2025-06-30'
  },
  {
    id: 3,
    name: 'Producto 3',
    price: 300,
    stock: 15,
    expiryDate: '2025-09-15'
  },
  // Agrega más productos según sea necesario
];

const ProductList = () => {
  const [products, setProducts] = useState(initialProducts);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ color: 'primary.main' }}>
            Productos
          </Typography>
          <Button variant="contained" color="primary" onClick={handleDialogOpen}>
            Agregar
          </Button>
        </Box>
        <List>
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </List>
      </Paper>
      <AddProductDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        handleAddProduct={handleAddProduct}
      />
    </Container>
  );
};

export default ProductList;
