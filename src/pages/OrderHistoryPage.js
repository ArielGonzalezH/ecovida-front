import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Cookies from "js-cookie";
import {jwtDecode} from 'jwt-decode';
import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from "@mui/material";

// Función para obtener el user_id desde el token
const getUserIDFromToken = (token) => {
  const decodedToken = jwtDecode(token);
  return decodedToken.sub.user; // Asegúrate de que el token contenga el user_id
};

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const user_id = getUserIDFromToken(Cookies.get("token"));

  useEffect(() => {
    if (user_id) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`http://localhost/api/sale_headers/sale_headers/${user_id}`);
          const data = response.data;

          console.log("Datos recibidos de la API:", data);

          const formattedData = data.map((order) => ({
            ...order,
            sale_date: new Date(order.sale_date).toISOString().replace("T", " ").substring(0, 19)
          }));

          setOrders(formattedData);
          setFilteredOrders(formattedData);
        } catch (error) {
          console.error("Error fetching order data:", error);
        }
      };
      fetchOrders();
    }
  }, [user_id]);

  const applyFilters = () => {
    if (startDate && endDate) {
      const filtered = orders.filter((order) => {
        const saleDate = new Date(order.sale_date);
        return saleDate >= startDate && saleDate <= endDate;
      });
      setFilteredOrders(filtered);
    }
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredOrders(orders);
  };

  const handleShowDetails = async (sh_id) => {
    setSelectedOrderId(sh_id);
    try {
      const response = await axios.get(`http://localhost/api/sale_items/sale_items/${sh_id}`);
      console.log("Detalles del pedido:", response.data);
      setOrderDetails(response.data);
      setDetailsOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  return (
    <Container>
      <h2>Histórico de Pedidos</h2>
      <div style={{ marginBottom: '20px' }}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Fecha de inicio"
          dateFormat="yyyy-MM-dd"
          customInput={<TextField variant="outlined" margin="normal" fullWidth />}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="Fecha de fin"
          dateFormat="yyyy-MM-dd"
          customInput={<TextField variant="outlined" margin="normal" fullWidth />}
        />
        <Button variant="contained" color="primary" onClick={applyFilters} style={{ marginLeft: '10px' }}>
          Aplicar Filtros
        </Button>
        <Button variant="outlined" color="secondary" onClick={resetFilters} style={{ marginLeft: '10px' }}>
          Restablecer Filtros
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Pedido</TableCell>
              <TableCell>Fecha de Venta</TableCell>
              <TableCell>Sub Total</TableCell>
              <TableCell>IVA</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.sh_id}>
                  <TableCell>{order.sh_id}</TableCell>
                  <TableCell>{order.sale_date}</TableCell>
                  <TableCell>{order.sale_sub}</TableCell>
                  <TableCell>{order.sale_IVA}</TableCell>
                  <TableCell>{order.sale_total}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleShowDetails(order.sh_id)}>
                      Mostrar Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" align="center">No se encontraron pedidos para el rango de fechas seleccionado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={detailsOpen} onClose={handleCloseDetails}>
        <DialogTitle>Detalles del Pedido</DialogTitle>
        <DialogContent>
          <List>
            {orderDetails.map((item) => (
              <ListItem key={item.item_id}>
                <ListItemText 
                  primary={`${item.product_name} (ID: ${item.item_id})`} 
                  secondary={`Cantidad: ${item.item_quantity}, Precio: ${item.product_price}, Precio Total: ${(item.item_quantity * parseFloat(item.product_price)).toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default OrderHistoryPage;
