

import {
    Autocomplete,
    Box,
    Button,
    Modal,
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
  
  const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productStock, setProductStock] = useState("");
    const [productDueDate, setProductDueDate] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [openAddProductModal, setOpenAddProductModal] = useState(false);
    const [foundations, setFoundations] = useState([]);  
    const [selectedFoundation, setSelectedFoundation] = useState(null);

    const loadFoundations = async () => {
        const token = Cookies.get("token");
        try {
            const res = await fetch("http://localhost/api/foundations/foundations", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
        
            if (!res.ok) {
                console.log("Error en la respuesta del servidor ", res);
                throw new Error("Error en la respuesta del servidor");
            }

            const data = await res.json();
            console.log(data);
            if (Array.isArray(data)) {
                setFoundations(data);
            } else {
                toast.error("Error al cargar las fundaciones");
            }
        } catch (error) {
            console.error(error);
        }
    };

  
    const handleAddProduct = async () => {
      const token = Cookies.get("token");
      try {
        const res = await fetch("http://localhost/api/products/productos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            found_id: selectedFoundation?.found_id,
            product_name: productName,
            product_price: productPrice,
            product_stock: productStock,
            product_duedate: productDueDate,
            product_description: productDescription,
          }),
        });
  
        if (!res.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
  
        toast.success("Producto creado exitosamente.");
        setOpenAddProductModal(false);
        loadProducts();
      } catch (error) {
        toast.error("Error al crear el producto.");
      }
    };
  
    const loadProducts = async () => {
      const token = Cookies.get("token");
      try {
        const res = await fetch("http://localhost/api/products/productos", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!res.ok) {
            console.log("Error en la respuesta del servidor ", res);
            throw new Error("Error en la respuesta del servidor");
          }
    
          const data = await res.json();
    
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            toast.error("Error al cargar los productos");
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      const deleteProduct = async (id) => {
        const token = Cookies.get("token");
        try {
          const res = await fetch(`http://localhost/api/products/productos/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
    
          if (!res.ok) {
            throw new Error("Error en la respuesta del servidor");
          }
    
          toast.success("Producto eliminado exitosamente.");
          loadProducts();
        } catch (error) {
          toast.error("Error al eliminar el producto.");
        }
      };
    
      useEffect(() => {
        loadProducts();
        loadFoundations();
      }, []);
    
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
              onClick={() => setOpenAddProductModal(true)}
            >
              Crear nuevo producto
            </Button>
            <TextField
              id="outlined-basic"
              label="Buscar producto"
              variant="outlined"
              sx={{ margin: 1 }}
            />
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
                  <TableCell>Nombre</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Fecha de Vencimiento</TableCell>
                  <TableCell>Descripción</TableCell>
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
                      <Button variant="contained" sx={{ bgcolor: "red" }}
                        onClick={() => deleteProduct(product.product_id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Modal open={openAddProductModal} onClose={() => setOpenAddProductModal(false)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "60%",
                bgcolor: "rgb(204, 204, 204)",
                boxShadow: 24,
                p: 4,
                borderRadius: "5px",
              }}
            >
              <h1>Crear nuevo producto</h1>
              <Autocomplete 
                options={foundations}
                getOptionLabel={(option) => option.found_name}
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Fundación" />}
                onChange={(event, value) => setSelectedFoundation(value)}
              />
              <TextField
                required
                sx={{ margin: ".5rem .5rem", width: "80%" }}
                id="outlined-required"
                label="Nombre"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <TextField
                required
                sx={{ margin: ".5rem .5rem", width: "80%" }}
                id="outlined-required"
                label="Precio Unitario"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                type="number"
              />
              <TextField
                required
                sx={{ margin: ".5rem .5rem", width: "80%" }}
                id="outlined-required"
                label="Stock"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
                type="number"
              />
              <TextField
                required
                sx={{ margin: ".5rem .5rem", width: "80%" }}
                id="outlined-required"
                label="Fecha de Vencimiento"
                value={productDueDate}
                onChange={(e) => setProductDueDate(e.target.value)}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                sx={{ margin: ".5rem .5rem", width: "80%" }}
                id="outlined-required"
                label="Descripción"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{ margin: ".5rem .5rem" }}
                onClick={handleAddProduct}
              >
                Crear
              </Button>
            </Box>
          </Modal>
        </Box>
      );
    };
    
    export default ProductList;
    
  
