import { Autocomplete, Box, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { useState } from "react";
import { Button } from "reactstrap"
import { toast } from "react-toastify"
import config from "../config"
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";

const NewQuotation = () => {
    const [areas, setAreas] = useState([]);
    const [costCenter, setCostCenter] = useState(null);
    const [costCenters, setCostCenters] = useState([]);
    const [filter, setFilter] = useState("");
    const [filteredAreas, setFilteredAreas] = useState([]);
    const [products, setProducts] = useState([]);
    const [quotationItems, setQuotationItems] = useState([]);
    const [selectedCostCenter, setSelectedCostCenter] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [unregisteredProduct, setUnregisteredProduct] = useState({
        item_name: '',
        item_unitprice: '',
        item_quantity: '',
        item_description: ''
    });

    const [openAddProductModal, setOpenAddProductModal] = useState(false);
    const [openAddProductNotRegisteredModal, setOpenAddProductNotRegisteredModal] = useState(false);

    const navigate = useNavigate();

    const handleCloseAddProductModal = () => {
        setOpenAddProductModal(false);
    };

    const handleCloseAddUnregisteredProductModal = () => {
        resetUnregisteredProduct();
        setOpenAddProductNotRegisteredModal(false);
    };

    const resetUnregisteredProduct = () => {
        setUnregisteredProduct({
            item_name: '',
            item_unitprice: '',
            item_quantity: '',
            item_description: ''
        });
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredProducts = products.filter((product) => {
        const wordsFilter = filter.toLowerCase().split(' ');

        return wordsFilter.every((word) =>
            product.product_name.toLowerCase().includes(word) ||
            product.product_description.toLowerCase().includes(word)
        );
    });

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
            toast.error('Error al cargar los datos de proveedores.');
        };
    };

    const loadCostCenters = async () => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/costcenters`, {
            headers: {
                token: token
            }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
            setCostCenters(data);
        } else {
            toast.error('Error al cargar los datos de centros de costos.');
        };
    };

    const loadAreas = async () => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/areas`, {
            headers: {
                token: token
            }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
            setAreas(data);
        } else {
            toast.error('Error al cargar los datos de áreas.');
        };
    };

    const loadProductsBySupplier = async (supplierId) => {
        const token = Cookies.get('token');
        try {
            const res = await fetch(`${config.apiBaseUrl}/productsbysupplier/${supplierId}`, {
                headers: {
                    token: token
                }
            });
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setProducts(data);
            } else {
                setProducts([]);
            };
        } catch (error) {
            toast.error('Error al cargar los productos del proveedor o el proveedor no tiene productos registrados.');
        };
    };

    const handleSelectedCostCenter = (costCenter) => {
        setSelectedCostCenter(costCenter);
        updateAreas(costCenter);
    };

    const handleSelectedArea = (area) => {
        setSelectedArea(area);
    }

    const handleAddProductToQuotation = (product) => {
        const newItem = {
            product_id: product.product_id,
            item_name: product.product_name,
            item_unitprice: product.product_unitprice,
            item_quantity: product.item_quantity || 1,
            item_description: product.product_description,
        };
        setQuotationItems([...quotationItems, newItem]);
    };

    const handleAddUnregisteredProductToQuotation = () => {
        const newItem = {
            product_id: null,
            item_name: unregisteredProduct.item_name,
            item_unitprice: unregisteredProduct.item_unitprice,
            item_quantity: unregisteredProduct.item_quantity,
            item_description: unregisteredProduct.item_description
        };
        setQuotationItems([...quotationItems, newItem]);

        setUnregisteredProduct({
            item_name: '',
            item_unitprice: '',
            item_quantity: '',
            item_description: ''
        });
    };

    const handleRemoveProductFromQuotation = (index) => {
        const updatedItems = quotationItems.filter((_, i) => i !== index);
        setQuotationItems(updatedItems);
    }

    const updateAreas = (costCenter) => {
        const filteredAreas = Array.isArray(areas) ? areas.filter((area) => area.costcenter_id === costCenter?.costcenter_id) : [];
        setFilteredAreas(filteredAreas);
    };

    const handleAddQuotation = async () => {
        const token = Cookies.get('token');
        const quotation = {
            area_id: selectedArea.area_id,
            user_id: Cookies.get('id'),
            quotation_date: new Date(),
            quotation_status: 'Pendiente',
            items: quotationItems
        };
        console.log(quotation);
        try {
            const res = await fetch(`${config.apiBaseUrl}/quotation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token
                },
                body: JSON.stringify(quotation)
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                toast.success('Cotización creada correctamente.');
                navigate('/quotation');
            } else {
                toast.error('Error al crear la cotización.');
            }
        } catch (error) {
            toast.error('Error al crear la cotización.');

        };
    };

        useState(() => {
            loadSuppliers();
            loadCostCenters();
            loadAreas();
        }, []);

        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    width: "90%",
                    height: "90%",
                    bgcolor: "rgb(204, 204, 204)",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: "5px"
                }}
            >
                <h1 style={{ marginBottom: "1rem" }}>Nueva cotización</h1>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        marginBottom="1rem"
                    >
                        <Autocomplete
                            options={costCenters}
                            getOptionLabel={(option) => option.costcenter_name}
                            style={{ width: 300, marginRight: "1rem" }}
                            renderInput={(params) => <TextField {...params} label="Centro de costo" />}
                            onChange={(event, value) => handleSelectedCostCenter(value)}
                        />
                        <Autocomplete
                            options={filteredAreas}
                            getOptionLabel={(option) => option.area_name}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Área" />}
                            onChange={(event, value) => handleSelectedArea(value)}
                        />
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        width="100%"
                    >
                        <Button
                            onClick={() => setOpenAddProductModal(true)}
                            style={{ marginRight: "1rem" }}
                        >
                            Agregar producto registrado
                        </Button>
                        <Button
                            onClick={() => setOpenAddProductNotRegisteredModal(true)}
                        >
                            Agregar producto volátil
                        </Button>
                    </Box>
                    <TableContainer component={Paper} style={{ width: "100%", maxHeight: 300, overflowX: "scroll", overflowY: "scroll", marginTop: "1rem" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre del Producto</TableCell>
                                    <TableCell>Precio Unitario</TableCell>
                                    <TableCell>Cantidad</TableCell>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {quotationItems.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.item_name}</TableCell>
                                        <TableCell>{item.item_unitprice}</TableCell>
                                        <TableCell>{item.item_quantity}</TableCell>
                                        <TableCell>{item.item_description}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleRemoveProductFromQuotation(index)}
                                            >
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        marginTop="1rem"
                    >
                        <Button
                            style={{ marginRight: "1rem" }}
                            onClick={handleAddQuotation}
                        >
                            Guardar cotización
                        </Button>
                        <Button
                            onClick={() => navigate('/quotation')}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
                <Modal
                    open={openAddProductModal}
                    onClose={handleCloseAddProductModal}
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
                            width: "60%",
                            bgcolor: "rgb(204, 204, 204)",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "5px"
                        }}
                    >
                        <h1 style={{ marginBottom: "1rem" }}>Añadir productos a la cotización</h1>
                        <Box
                            sx={{
                                display: "flex"
                            }}
                        >
                            <Autocomplete
                                options={suppliers}
                                getOptionLabel={(option) => option.supplier_name}
                                style={{ width: 300, marginRight: "1rem" }}
                                renderInput={(params) => <TextField {...params} label="Proveedor" />}
                                onChange={(event, value) => {
                                    if (value) {
                                        loadProductsBySupplier(value.supplier_id);
                                    } else {
                                        setProducts([]);
                                    }
                                }}
                            />
                            <TextField
                                label="Buscar producto"
                                variant="outlined"
                                value={filter}
                                onChange={handleFilterChange}
                                style={{ marginBottom: "1rem", width: "60%" }}
                            />
                        </Box>
                        <TableContainer component={Paper} style={{ width: "100%", maxHeight: 350, overflowX: "scroll", overflowY: "scroll" }}>
                            <Table>
                                <TableHead stickyHeader>
                                    <TableCell>Producto</TableCell>
                                    <TableCell>Precio Unitario</TableCell>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>Cantidad</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableHead>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.product_id}>
                                            <TableCell>{product.product_name}</TableCell>
                                            <TableCell>{product.product_unitprice}</TableCell>
                                            <TableCell>{product.product_description}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    variant="outlined"
                                                    defaultValue={1}
                                                    inputProps={{ min: 1 }}
                                                    onChange={(event) => product.item_quantity = Number(event.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleAddProductToQuotation(product)}>
                                                    Agregar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Modal>
                <Modal
                    open={openAddProductNotRegisteredModal}
                    onClose={handleCloseAddUnregisteredProductModal}
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
                            width: "60%",
                            bgcolor: "rgb(204, 204, 204)",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "5px"
                        }}
                    >
                        <h1 style={{ textAlign: "center" }}>Añadir producto no registrado a la cotización</h1>
                        <TextField
                            label="Nombre del producto"
                            variant="outlined"
                            value={unregisteredProduct.item_name}
                            onChange={(e) => setUnregisteredProduct({ ...unregisteredProduct, item_name: e.target.value })}
                            style={{ marginBottom: "1rem", width: "70%" }}
                        />
                        <TextField
                            label="Descripción"
                            variant="outlined"
                            value={unregisteredProduct.item_description}
                            onChange={(e) => setUnregisteredProduct({ ...unregisteredProduct, item_description: e.target.value })}
                            style={{ marginBottom: "1rem", width: "70%" }}
                            multiline
                            rows={4}
                            inputProps={{
                                maxLength: 255
                            }}
                        />
                        <TextField
                            label="Precio unitario"
                            variant="outlined"
                            value={unregisteredProduct.item_unitprice}
                            onChange={(e) => setUnregisteredProduct({ ...unregisteredProduct, item_unitprice: e.target.value })}
                            style={{ marginBottom: "1rem" }}
                        />
                        <TextField
                            label="Cantidad"
                            type="number"
                            variant="outlined"
                            value={unregisteredProduct.item_quantity}
                            inputProps={{ min: 1 }}
                            onChange={(e) => setUnregisteredProduct({ ...unregisteredProduct, item_quantity: e.target.value })}
                            style={{ marginBottom: "1rem" }}
                        />
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Button
                                onClick={handleAddUnregisteredProductToQuotation}
                                style={{ marginRight: "1rem" }}
                            >
                                Añadir
                            </Button>
                            <Button
                                onClick={handleCloseAddUnregisteredProductModal}
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        )
    }

    export default NewQuotation;