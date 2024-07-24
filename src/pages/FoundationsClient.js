import { Box, Card, CardContent, Typography, Grid, TextField, Modal, List, ListItem, ListItemText, Button } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const FoundationsClient = () => {
  const [foundations, setFoundations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openProductsModal, setOpenProductsModal] = useState(false);
  const [selectedFoundation, setSelectedFoundation] = useState(null);
  const [products, setProducts] = useState([]);

  const loadFoundations = async () => {
    const token = Cookies.get("token");
    const response = await fetch(
      "http://localhost/api/foundations/foundations",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setFoundations(data);
    } else {
      console.error("Error fetching foundations");
    }
  };

  const loadProducts = async (foundationId) => {
    const token = Cookies.get("token");
    const response = await fetch(
      `http://localhost/api/products/productos/foundation/${foundationId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setProducts(data);
    } else {
      console.error("Error fetching products");
    }
  };

  const handleOpenProductsModal = (foundation) => {
    setSelectedFoundation(foundation);
    loadProducts(foundation.found_id);
    setOpenProductsModal(true);
  };

  const handleCloseProductsModal = () => {
    setOpenProductsModal(false);
    setSelectedFoundation(null);
    setProducts([]);
  };

  useEffect(() => {
    loadFoundations();
  }, []);

  const filteredFoundations = foundations.filter(foundation =>
    foundation.found_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "rgb(240, 242, 245)",
        padding: 2
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Lista de fundaciones
      </Typography>
      <TextField
        label="Buscar fundación"
        variant="outlined"
        sx={{ marginBottom: "2rem", width: "70%" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={3}>
        {filteredFoundations.map((foundation) => (
          <Grid item xs={12} sm={6} md={4} key={foundation.found_id}>
            <Card sx={{ maxWidth: 345 }} onClick={() => handleOpenProductsModal(foundation)}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {foundation.found_name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {foundation.found_ruc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal para mostrar productos */}
      <Modal open={openProductsModal} onClose={handleCloseProductsModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Productos de {selectedFoundation?.found_name}
          </Typography>
          <List>
            {products.length > 0 ? (
              products.map((product) => (
                <ListItem key={product.product_id}>
                  <ListItemText
                    primary={product.product_name}
                    secondary={`Precio: ${product.product_price}, Stock: ${product.product_stock}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>No hay productos disponibles.</Typography>
            )}
          </List>
          <Button onClick={handleCloseProductsModal} variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default FoundationsClient;
