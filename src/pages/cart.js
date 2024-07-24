import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { useState } from "react";

const CartPage = ({ cart, onClearCart }) => {
  const [selectedFoundation, setSelectedFoundation] = useState(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        backgroundColor: "rgb(240, 242, 245)",
        padding: 2
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Carrito de Compras
      </Typography>
      <TableContainer component={Paper} sx={{ width: "80%", maxHeight: 400 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.product_price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.product_price * item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: "1rem" }}
        onClick={() => onClearCart()}
      >
        Limpiar Carrito
      </Button>
    </Box>
  );
};

export default CartPage;
