import { Autocomplete, Box, Modal, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import config from '../config';
import Cookies from 'js-cookie';

const Products = () => {
    useEffect(() => {
        loadProducts();
        loadSuppliers();
    }, []);

    const params = useParams();

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [product, setProduct] = useState({});
    const [filter, setFilter] = useState('');

    const [openAddProductModal, setOpenAddProductModal] = useState(false);
    const [openEditProductModal, setOpenEditProductModal] = useState(false);
    const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);

    const handleCloseProductDetailsModal = () => {
        setOpenProductDetailsModal(false);
        setSelectedProduct(null);
        setSelectedSupplier(null);
    }

    const handleCloseEditProductModal = () => {
        setOpenEditProductModal(false);
        setSelectedProduct(null);
        setSelectedSupplier(null);
    }

    const handleCloseAddProductModal = () => {
        setOpenAddProductModal(false);
        setProduct({});
        setSelectedSupplier(null);
    }

    const handleInputChange = (e, value) => {
        if (value && value.supplier_name) {
            setSelectedSupplier(value);
        }
    }

    const handleNewProductChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value })
    }

    const handleSelectedProductChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct({ ...selectedProduct, [name]: value })
    }

    const handleAddProduct = async () => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: token
            },
            body: JSON.stringify({
                ...product,
                supplier_id: selectedSupplier.supplier_id
            })
        });
        const data = await res.json();
        if (data) {
            toast.success('Producto agregado correctamente');
            handleCloseAddProductModal();
            loadProducts();
        } else {
            toast.error('Error al agregar el producto');
        }
    }

    const handleEditProduct = async () => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/product/${selectedProduct.product_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                token: token
            },
            body: JSON.stringify({
                ...selectedProduct,
                supplier_id: selectedSupplier.supplier_id
            })
        });

        if (res.ok) {
            try {
                const data = await res.json();
                toast.success('Producto editado correctamente');
                loadProducts();
                handleCloseEditProductModal();
            } catch (error) {
                toast.error('Producto editado correctamente, pero hubo un problema con la respuesta del servidor');
                loadProducts();
                handleCloseEditProductModal();
            }
        } else {
            toast.error('Error al editar el producto');
        }
    }

    const handleDeleteProduct = async (product) => {
        const token = Cookies.get('token');
        
        const res = await fetch(`${config.apiBaseUrl}/product/${product.product_id}`, {
            method: 'DELETE',
            headers: {
                token: token
            }
        });
    
        if (res.ok) {
            try {
                const data = await res.json();
                toast.success('Producto eliminado correctamente');
                loadProducts();
            } catch (error) {
                toast.error('Producto eliminado correctamente, pero hubo un problema con la respuesta del servidor');
            }
        } else {
            toast.error('Error al eliminar el producto');
        }
    }    

    const handleOpenEditProduct = (product) => (e) => {
        e.stopPropagation();
        setSelectedProduct(product);
        setSelectedSupplier(suppliers.find(supplier => supplier.supplier_id === product.supplier_id));
        setOpenEditProductModal(true);
    }

    const handleOpenProductDetails = (product) => () => {
        setSelectedProduct(product);
        setSelectedSupplier(suppliers.find(supplier => supplier.supplier_id === product.supplier_id));
        setOpenProductDetailsModal(true);
    }

    const filteredProducts = products.filter((product) => {
        const wordsFilter = filter.toLowerCase().split(" ");
    
        return wordsFilter.every((word) =>
            (product.product_name?.toLowerCase().includes(word) || "") ||
            (product.supplier_name?.toLowerCase().includes(word) || "")
        );
    });   

    const loadProducts = async () => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/productswithsupplier`, {
            headers: {
                token: token
            }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
            setProducts(data);
        } else {
            toast.error('Error al cargar los productos')
        }
    }

    const loadSuppliers = async () => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/suppliers`, {
            headers: {
                token: token
            }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
            setSuppliers(data);
        } else {
            toast.error('Error al cargar los proveedores');
        }
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            sx={{ backgroundColor: "gray" }}
        >
            <h1>Productos</h1>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
            >
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="60%"
                    marginBottom={2}
                >
                    <Button
                        onClick={() => setOpenAddProductModal(true)}
                    >
                        Nuevo Producto
                    </Button>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={suppliers}
                        getOptionLabel={(option) => option.supplier_name}
                        sx={{ width: "50%" }}
                        renderInput={(params) => <TextField {...params} label="Filtrar por proveedor" />}
                        onChange={(event, value) => setFilter(value ? value.supplier_name : '')}
                    />
                </Box>
                <TableContainer
                    component={Paper}
                    style={{
                        width: "90%",
                        maxHeight: "70vh",
                        overflowY: "scroll",
                        overflowX: "scroll"
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ backgroundColor: "rgb(204, 204, 204)" }}>Nombre del producto</TableCell>
                                <TableCell style={{ backgroundColor: "rgb(204, 204, 204)" }}>Precio Unitario</TableCell>
                                <TableCell style={{ backgroundColor: "rgb(204, 204, 204)" }}>Nombre del proveedor</TableCell>
                                <TableCell style={{ backgroundColor: "rgb(204, 204, 204)" }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow 
                                    key={product.product_id}
                                    onClick={handleOpenProductDetails(product)}
                                    style={{ cursor: "pointer"}}
                                >
                                    <TableCell>{product.product_name}</TableCell>
                                    <TableCell>{product.product_unitprice}</TableCell>
                                    <TableCell>{product.supplier_name}</TableCell>
                                    <TableCell>
                                        <Button style={{ marginRight: "1rem" }} onClick={handleOpenEditProduct(product)}>Editar</Button>
                                        <Button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product)}}>Eliminar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Modal open={openAddProductModal} onClose={handleCloseAddProductModal}>
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
                        borderRadius: "5px"
                    }}
                >
                    <h3 style={{ textAlign: "center" }}>Agregar producto</h3>
                    <Autocomplete
                        sx={{ width: "60%", margin: "1rem .5rem" }}
                        variant="standard"
                        options={suppliers}
                        getOptionLabel={(option) => option.supplier_name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Proveedor"
                                variant="standard"
                            />
                        )}
                        onChange={(e, value) => handleInputChange(e, value)}
                        disableClearable={true}
                    />
                    <TextField
                        label="Nombre del producto"
                        variant="outlined"
                        name="product_name"
                        value={product.product_name}
                        onChange={handleNewProductChange}
                        style={{ width: "60%", marginBottom: "1rem" }}
                    />
                    <TextField
                        label="Precio unitario"
                        variant="outlined"
                        name="product_unitprice"
                        value={product.product_unitprice}
                        onChange={handleNewProductChange}
                        style={{ width: "60%", marginBottom: "1rem" }}
                    />
                    <TextField
                        label="Descripción del producto"
                        variant="outlined"
                        name="product_description"
                        value={product.product_description}
                        onChange={handleNewProductChange}
                        style={{ width: "60%", marginBottom: "1rem" }}
                        multiline
                        rows={4}
                        inputProps={{
                            maxLength: 255
                        }}
                    />
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-evenly"
                        width="60%"
                    >
                        <Button
                            onClick={handleAddProduct}
                        >
                            Agregar
                        </Button>
                        <Button
                            onClick={handleCloseAddProductModal}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={openEditProductModal} onClose={handleCloseEditProductModal}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent:"center",
                        position:"absolute",
                        top:"50%",
                        left:"50%",
                        transform:"translate(-50%, -50%)",
                        width:"60%",
                        bgcolor:"rgb(204, 204, 204)",
                        boxShadow:24,
                        p:4,
                        borderRadius:"5px"
                    }}
                >
                    <h3>Editar producto</h3>
                    <Autocomplete
                        sx={{ width: "60%", margin: "1rem .5rem" }}
                        variant="standard"
                        options={suppliers}
                        getOptionLabel={(option) => option.supplier_name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Proveedor"
                                variant="standard"
                            />
                        )}
                        name="supplier_name"
                        onChange={(e, value) => handleInputChange(e, value)}
                        disableClearable={true}
                        value={selectedSupplier}
                    />
                    <TextField
                        label="Nombre del producto"
                        variant="outlined"
                        name="product_name"
                        value={selectedProduct?.product_name}
                        onChange={handleSelectedProductChange}
                        style={{ width: "60%", marginBottom: "1rem" }}
                    />
                    <TextField
                        label="Precio unitario"
                        variant="outlined"
                        name="product_unitprice"
                        value={selectedProduct?.product_unitprice}
                        onChange={handleSelectedProductChange}
                        style={{ width: "60%", marginBottom: "1rem" }}
                    />
                    <TextField
                        label="Descripción del producto"
                        variant="outlined"
                        name="product_description"
                        value={selectedProduct?.product_description}
                        onChange={handleSelectedProductChange}
                        style={{ width: "60%", marginBottom: "1rem" }}
                        multiline
                        rows={4}
                        inputProps={{
                            maxLength: 255
                        }}
                    />
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-evenly"
                        width="60%"
                    >
                        <Button
                            onClick={handleEditProduct}
                        >
                            Guardar
                        </Button>
                        <Button
                            onClick={handleCloseEditProductModal}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={openProductDetailsModal} onClose={handleCloseProductDetailsModal}>
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
                        borderRadius: "5px"
                    }}
                >
                    <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Detalles del producto</h3>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            marginBottom: "1rem"
                        }}
                    >
                        <image>Aquí va la imagen del producto</image>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "60%",
                                marginBottom: "1rem",
                                padding: "1rem"
                            }}
                        >
                            <p style={{ textAlign: "start", width: "100%" }}><span style={{ fontWeight: "bold" }}>Nombre del producto: </span>{selectedProduct?.product_name}</p>
                            <p style={{ textAlign: "start", width: "100%" }}><span style={{ fontWeight: "bold" }}>Precio unitario: </span>{selectedProduct?.product_unitprice}</p>
                            <p style={{ textAlign: "start", width: "100%" }}><span style={{ fontWeight: "bold" }}>Detalles: </span>{selectedProduct?.product_description}</p>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

export default Products;