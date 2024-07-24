import { Box, Card, CardContent, Typography, Grid, TextField, Modal, List, ListItem, ListItemText, Button } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Cambia useHistory por useNavigate

const FoundationsClient = () => {
  const [foundations, setFoundations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Cambia useHistory por useNavigate

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

  useEffect(() => {
    loadFoundations();
  }, []);

  const filteredFoundations = foundations.filter(foundation =>
    foundation.found_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenProductsPage = (foundationId) => {
    navigate(`/products/${foundationId}`);
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
            <Card sx={{ maxWidth: 345 }} onClick={() => handleOpenProductsPage(foundation.found_id)}>
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
    </Box>
  );
};

export default FoundationsClient;
