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
import soapRequest from "easy-soap-request";
import axios from "axios";


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productDueDate, setProductDueDate] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [openEditProductModal, setOpenEditProductModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [foundations, setFoundations] = useState([]);
  const [selectedFoundation, setSelectedFoundation] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [openCommentListModal, setOpenCommentListModal] = useState(false);

  const loadComments = async (product_product_id) => {
    console.log("Cargando comentarios para el producto con ID:", product_product_id);
    const token = Cookies.get("token");
    try {
      const res = await fetch(
        `http://localhost/api/comments/comentarios/${product_product_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setComments(data);
        setOpenCommentListModal(true);
      } else {
        toast.error("Error al cargar los comentarios");
      }
    } catch (error) {
      console.error("Error al cargar los comentarios:", error);
      toast.error("Error al cargar los comentarios");
    }
  };

  const loadFoundations = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch("http://localhost/api/foundations/foundations", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setFoundations(data);
        console.log("Fundaciones cargadas:", data);
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
          Authorization: `Bearer ${token}`,
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

  const handleAddComment = async (product_id) => {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");

    if (!userCookie) {
      toast.error("No se encontraron datos del usuario.");
      return;
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userCookie));
      const user_id = userData.user_id;

      const res = await fetch("http://localhost/api/comments/comentarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id,
          user_id,
          comment_text: commentContent,
        }),
      });

      if (res.ok) {
        toast.success("Comentario añadido exitosamente.");
        setOpenCommentModal(false);
        setCommentContent(""); // Limpiar el contenido del comentario
      } else {
        console.error("Error en la respuesta del servidor:", res);
        toast.error("Error al añadir el comentario.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al añadir el comentario.");
    }
  };

  const loadProducts = async () => {
    const token = Cookies.get("token");
    const userId = JSON.parse(Cookies.get("user")).user_id;

    try {
      const res = await fetch(`http://localhost/api/products/user_foundation_product/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("Error en la respuesta del servidor ", res);
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await res.json();

      // Procesar el JSON para extraer las fundaciones y sus productos
      const productsWithFoundation = data.foundations.flatMap((foundation) =>
        foundation.products.map((product) => ({
          ...product,
          foundationName: foundation.foundation.foundation_found_name, // Agregar el nombre de la fundación al producto
        }))
      );

      setProducts(productsWithFoundation);
      console.log("Productos cargados:", productsWithFoundation);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los productos");
    }
  };

  const handleEditProduct = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(
        `http://localhost/api/products/productos/${selectedProduct.product_product_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            found_id:
              selectedFoundation?.foundation_found_id || selectedProduct.product_found_id,
            product_name: productName,
            product_price: productPrice,
            product_stock: productStock,
            product_duedate: productDueDate,
            product_description: productDescription,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      toast.success("Producto actualizado exitosamente.");
      setOpenEditProductModal(false);
      loadProducts();
    } catch (error) {
      toast.error("Error al actualizar el producto.");
    }
  };

  const deleteProduct = async (id) => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(
        `http://localhost/api/products/productos/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      toast.success("Producto eliminado exitosamente.");
      loadProducts();
    } catch (error) {
      toast.error("Error al eliminar el producto.");
    }
  };

  const handleOpenEditProductModal = (product) => {
    setSelectedProduct(product);
    setProductName(product.product_name);
    setProductPrice(product.product_price);
    setProductStock(product.product_stock);
    setProductDueDate(new Date(product.product_duedate).toISOString().split('T')[0]);
    setProductDescription(product.product_description);
  
    const associatedFoundation = foundations.find((foundation) => foundation.found_id === product.found_id);
    setSelectedFoundation(associatedFoundation || null);
  
    setOpenEditProductModal(true);
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
              <TableCell>Fundación</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Fecha de Vencimiento</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.product_product_id}>
                <TableCell>{product.product_product_name}</TableCell>
                <TableCell>{product.foundationName}</TableCell> {/* Mostrar el nombre de la fundación */}
                <TableCell>{product.product_product_price}</TableCell>
                <TableCell>{product.product_product_stock}</TableCell>
                <TableCell>{new Date(product.product_product_duedate).toLocaleDateString()}</TableCell>
                <TableCell>{product.product_product_description}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenEditProductModal(product)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "red" }}
                      onClick={() => deleteProduct(product.product_product_id)}
                    >
                      Eliminar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "green", marginRight: 1 }}
                        onClick={() => {
                          setSelectedProduct(product.product_product_id);
                          loadComments(product.product_product_id);
                        }}
                      >
                        Ver Comentarios
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "blue" }}
                        onClick={() => {
                          setSelectedProduct(product.product_product_id);
                          setOpenCommentModal(true);
                        }}
                      >
                        Añadir Comentario
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>


        </Table>
      </TableContainer>
      <Modal
        open={openCommentListModal}
        onClose={() => setOpenCommentListModal(false)}
      >
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
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h2>Comentarios</h2>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <Paper key={index} sx={{ padding: 2, margin: 1, width: "100%" }}>
                <p>
                  <strong>Usuario ID:</strong> {comment.user_id}
                </p>
                <p>{comment.comment_text}</p>
              </Paper>
            ))
          ) : (
            <p>No hay comentarios para este producto.</p>
          )}
        </Box>
      </Modal>
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
            renderInput={(params) => (
              <TextField {...params} label="Fundación" />
            )}
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

      <Modal open={openEditProductModal} onClose={() => setOpenEditProductModal(false)}>
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
          <h1>Editar producto</h1>
          <Autocomplete
            options={foundations}
            getOptionLabel={(option) => option.found_name}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Fundación" />}
            value={foundations.find((foundation) => foundation.found_id === selectedProduct?.found_id) || null}
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
            label="Precio"
            variant="outlined"
            sx={{ margin: 1 }}
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
          <TextField
            label="Stock"
            variant="outlined"
            sx={{ margin: 1 }}
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
          />
          <TextField
            label="Fecha de Vencimiento"
            variant="outlined"
            sx={{ margin: 1 }}
            value={productDueDate}
            onChange={(e) => setProductDueDate(e.target.value)}
          />
          <TextField
            label="Descripción"
            variant="outlined"
            sx={{ margin: 1 }}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditProduct}
            sx={{ marginTop: 2 }}
          >
            Guardar Producto
          </Button>
        </Box>
      </Modal>
      <Modal open={openCommentModal} onClose={() => setOpenCommentModal(false)}>
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
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Añadir Comentario</h2>
          <TextField
            label="Comentario"
            variant="outlined"
            sx={{ margin: 1 }}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddComment(selectedProduct)}
            sx={{ marginTop: 2 }}
          >
            Guardar Comentario
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductList;
