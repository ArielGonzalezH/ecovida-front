import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box } from '@mui/material';

const AddProductDialog = ({ open, handleClose, handleAddProduct }) => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    stock: '',
    expiryDate: ''
  });
  const [errors, setErrors] = useState({
    price: false,
    stock: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' && value < 0) {
      setErrors((prevErrors) => ({ ...prevErrors, price: true }));
    } else if (name === 'stock' && value < 0) {
      setErrors((prevErrors) => ({ ...prevErrors, stock: true }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    }
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = () => {
    if (product.price >= 0 && product.stock >= 0) {
      handleAddProduct(product);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar Producto</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nombre"
            name="name"
            value={product.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Precio Unitario"
            name="price"
            value={product.price}
            onChange={handleChange}
            fullWidth
            required
            type="number"
            error={errors.price}
            helperText={errors.price ? "El precio no puede ser negativo" : ""}
          />
          <TextField
            label="Stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            fullWidth
            required
            type="number"
            error={errors.stock}
            helperText={errors.stock ? "El stock no puede ser negativo" : ""}
          />
          <TextField
            label="Fecha de Vencimiento"
            name="expiryDate"
            value={product.expiryDate}
            onChange={handleChange}
            fullWidth
            required
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
