// CartPage.js
import React from 'react';
import { useCart } from './cartContext';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal } from '@mui/material';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { useEffect, useState } from "react";

const CartPage = () => {
  const [openAddCreditCardModal, setOpenCreditCardModal] = useState(false);
  const { cart, clearCart } = useCart();
  const [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: ''
  });

  const handleCheckout = () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Debe iniciar sesión para realizar una compra.");
      return;
    }

    setOpenCreditCardModal(true);
  };

  const validateCreditCardInfo = () => {
    const { cardNumber, expirationDate, securityCode } = creditCardInfo;

    // Validación del número de tarjeta (debe ser numérico y tener entre 13 y 19 dígitos)
    const cardNumberRegex = /^[0-9]{13,19}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      toast.error("Número de tarjeta inválido.");
      return false;
    }

    // Validación de la fecha de expiración (debe estar en formato MM/YY y ser una fecha futura)
    const expirationDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expirationDateRegex.test(expirationDate)) {
      toast.error("Fecha de expiración inválida.");
      return false;
    }

    const [expMonth, expYear] = expirationDate.split('/');
    const currentDate = new Date();
    const expDate = new Date(`20${expYear}`, expMonth - 1);

    if (expDate <= currentDate) {
      toast.error("La tarjeta está expirada.");
      return false;
    }

    // Validación del código de seguridad (debe ser numérico y tener 3 o 4 dígitos)
    const securityCodeRegex = /^[0-9]{3,4}$/;
    if (!securityCodeRegex.test(securityCode)) {
      toast.error("Código de seguridad inválido.");
      return false;
    }

    return true;
  };

  const handleAddCreditCard = async () => {
    if (!validateCreditCardInfo()) {
      return;
    }

    setOpenCreditCardModal(false);

    const token = Cookies.get("token");
    const user_id = getUserIDFromToken(token);

    const sales = cart.map(item => ({
      product_id: item.product_id,
      user_id: user_id,
      sale_date: new Date().toISOString(),
      sale_quantity: item.quantity
    }));

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreditCardInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const calculateSubTotal = () => {
    return cart.reduce((total, item) => total + item.product_price * item.quantity, 0);
  };

  const calculateIVA = () => {
    return calculateSubTotal() * 0.16;
  };

  const calculateTotal = () => {
    return calculateSubTotal() + calculateIVA();
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
          <h3>Subtotal: ${calculateSubTotal().toFixed(2)}</h3>
          <h3>IVA: ${calculateIVA().toFixed(2)}</h3>
          <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          <Button variant="contained" color="primary" onClick={handleCheckout}>
            Realizar compra
          </Button>
        </Box>
      )}
      <Modal open={openAddCreditCardModal} onClose={() => setOpenCreditCardModal(false)}>
        <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}>
          <h2>Agregar tarjeta de crédito</h2>
          <form>
            <input 
              type="text" 
              placeholder="Número de tarjeta" 
              name="cardNumber" 
              onChange={handleInputChange} 
              value={creditCardInfo.cardNumber} 
            />
            <input 
              type="text" 
              placeholder="Fecha de expiración (MM/YY)" 
              name="expirationDate" 
              onChange={handleInputChange} 
              value={creditCardInfo.expirationDate} 
            />
            <input 
              type="text" 
              placeholder="Código de seguridad" 
              name="securityCode" 
              onChange={handleInputChange} 
              value={creditCardInfo.securityCode} 
            />
            <Button variant="contained" color="primary" onClick={handleAddCreditCard}>
              Realizar compra
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default CartPage;
