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
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const FoundationsProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedFoundation, setSelectedFoundation] = useState(); // Asigna un valor temporal para probar
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();

  const loadProducts = async () => {
    const token = Cookies.get("token");
    console.log(`http://localhost/api/products/productos/foundation/${id}`);
    try {
      const res = await fetch(`http://localhost/api/products/productos/foundation/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("Error en la respuesta del servidor ", res);
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await res.json();

      console.log("Datos de productos recibidos:", data); // Imprimir datos para verificar

      if (Array.isArray(data)) {
        setProducts(data.filter((product) => product.found_id === selectedFoundation.found_id));
      } else {
        toast.error("Error al cargar los productos");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = (product) => {
    if (quantity > product.product_stock) {
      toast.error("La cantidad no puede superar el stock disponible.");
      return;
    }

    setCart([...cart, { ...product, quantity }]);
    toast.success("Producto agregado al carrito.");
  };

  useEffect(() => {
    if (selectedFoundation) {
      console.log("Cargando productos...");
      loadProducts();
    }
  }, [selectedFoundation]);

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
      <h1>Productos</h1>
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
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Fecha de Vencimiento</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.product_price}</TableCell>
                <TableCell>{product.product_stock}</TableCell>
                <TableCell>{product.product_duedate}</TableCell>
                <TableCell>{product.product_description}</TableCell>
                <TableCell>
                  <InputLabel htmlFor="quantity">Cantidad</InputLabel>
                  <Select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    sx={{ width: "100px" }}
                  >
                    {[...Array(product.product_stock).keys()].map((num) => (
                      <MenuItem key={num + 1} value={num + 1}>
                        {num + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addToCart(product)}
                  >
                    Agregar al Carrito
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal y demás elementos */}
    </Box>
  );
};

export default FoundationsProduct;
