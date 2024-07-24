import React from 'react';
import { Grid, Container, Button, Box, Typography } from '@mui/material';
import ProductCard from '../components/ProductCard';

const products = [
  {
    id: 1,
    name: 'Producto 1',
    price: 100,
    stock: 10,
    image: 'https://via.placeholder.com/140'
  },
  {
    id: 2,
    name: 'Producto 2',
    price: 200,
    stock: 5,
    image: 'https://via.placeholder.com/140'
  },
  {
    id: 3,
    name: 'Producto 3',
    price: 300,
    stock: 15,
    image: 'https://via.placeholder.com/140'
  },
  // Agrega más productos según sea necesario
];

const ProductList = () => {
  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
        <Typography variant="h4" component="h1">
          Productos
        </Typography>
        <Button variant="contained" color="primary">
          Agregar
        </Button>
      </Box>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
