// CartPage.js
import React from 'react';
import { useCart } from './cartContext';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const CartPage = () => {
  const { cart, clearCart } = useCart();

  const handleCheckout = async () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Debe iniciar sesión para realizar una compra.");
      return;
    }

    const user_id = getUserIDFromToken(token);

    const sales = cart.map(item => ({
      product_id: item.product_id,
      user_id: user_id,
      sale_date: new Date().toISOString(),
      sale_quantity: item.quantity
    }));

    console.log(JSON.stringify(sales));

    try {
      const response = await fetch('http://localhost/api/sales/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sales)
      });
      if (response.ok) {
        toast.success("Compra realizada con éxito.");
        clearCart();
      } else {
        const errorData = await response.json();
        toast.error(`Error al realizar la compra: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`Error al realizar la compra: ${error.message}`);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product_price * item.quantity, 0);
  };

  const getUserIDFromToken = (token) => {
    const decodedToken = jwtDecode(token);
    return decodedToken.user_id; // Asegúrate de que el token contenga el user_id
  };

  return (
    <Box m={2}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del producto</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.product_desc}</TableCell>
                <TableCell>{item.product_price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.product_price * item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {cart.length > 0 && (
        <Box mt={2}>
          <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          <Button variant="contained" color="primary" onClick={handleCheckout}>
            Realizar compra
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CartPage;
