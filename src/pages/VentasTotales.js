import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
  } from "@mui/material";
  
  import Cookies from "js-cookie";
  import { useEffect, useState } from "react";
  import { toast } from "react-toastify";
  import config from "../config";
  
  const VentasTotales = () => {
    const [ventas, setVentas] = useState([]);
  
    const loadVentas = async () => {
      const token = Cookies.get("token");
      try {
        const res = await fetch(`${config.apiBaseUrl}/api/sales/ventas`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!res.ok) {
          console.log("Error en la respuesta del servidor ", res);
          throw new Error("Error en la respuesta del servidor");
        }
  
        const data = await res.json();
  
        if (Array.isArray(data)) {
          setVentas(data);
        } else {
          toast.error("Error al cargar las ventas");
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "rgb(240, 242, 245)",
        }}
      >
        <h1>Ventas Totales</h1>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          width="55%"
          max="100%"
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ margin: 1 }}
            onClick={loadVentas}
          >
            Buscar
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            width: "80%",
            maxHeight: 300,
            overflowX: "scroll",
            overflowY: "scroll",
            marginTop: "1rem",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Venta</TableCell>
                <TableCell>ID Producto</TableCell>
                <TableCell>ID Usuario</TableCell>
                <TableCell>Fecha de Venta</TableCell>
                <TableCell>Cantidad Vendida</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.sale_id}>
                  <TableCell>{venta.sale_id}</TableCell>
                  <TableCell>{venta.product_id}</TableCell>
                  <TableCell>{venta.user_id}</TableCell>
                  <TableCell>{venta.sale_date}</TableCell>
                  <TableCell>{venta.sale_quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
  
  export default VentasTotales;
  