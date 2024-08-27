// FoundationsProduct.js
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
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "./cartContext";

const FoundationsProduct = () => {
  const [products, setProducts] = useState([]);
  const [foundation, setFoundation] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { found_id } = useParams();

  const loadProducts = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`http://localhost/api/products/productos/foundation/${found_id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("Error en la respuesta del servidor ", res);
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await res.json();

      console.log("Datos de productos recibidos:", data);

      if (Array.isArray(data)) {
        setProducts(data.filter(product => product.found_id === Number(found_id)));
        const initialQuantities = {};
        data.forEach(product => {
          initialQuantities[product.product_id] = 1; // Inicializar con 1
        });
        setQuantities(initialQuantities);
      } else {
        toast.error("Error al cargar los productos");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadFoundation = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`http://localhost/api/foundations/${found_id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("Error en la respuesta del servidor ", res);
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await res.json();
      setFoundation(data); // Establece los datos de la fundación en el estado
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadProducts();
    loadFoundation(); // Cargar la información de la fundación cuando se monta el componente
  }, []);
  
  const handleAddToCart = (product) => {
    const quantity = quantities[product.product_id];
    if (quantity > product.product_stock) {
      toast.error("La cantidad no puede superar el stock disponible.");
      return;
    }

    addToCart(product, quantity);
    console.log("Producto agregado: ", product, "Cantidad: ", quantity);
    toast.success("Producto agregado al carrito.");
  };

  const handleQuantityChange = (product_id, value) => {
    const numValue = Number(value);
    if (numValue > 0 && numValue <= products.find(p => p.product_id === product_id).product_stock) {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [product_id]: numValue,
      }));
    } else {
      toast.error("Cantidad inválida.");
    }
  };

  

  return (
    <Box m={2}>
      <Button variant="outlined" onClick={() => navigate(-1)}>
        Volver
      </Button>
      {foundation && (
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          Productos de la Fundación: {foundation ? foundation.found_name : "Fundación desconocida"}
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del producto</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Agregar al carrito</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.product_description}</TableCell>
                <TableCell>{product.product_price}</TableCell>
                <TableCell>{product.product_stock}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={quantities[product.product_id] || 1}
                    onChange={(e) => handleQuantityChange(product.product_id, e.target.value)}
                    inputProps={{ min: 1, max: product.product_stock }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Agregar al carrito
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FoundationsProduct;
