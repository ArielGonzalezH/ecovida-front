import { Box, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { Button } from "reactstrap";

import config from "../config";
import Cookies from 'js-cookie';

const Supplier = () => {
    useEffect(() => {
        loadSuppliers();
    }, []);

    const [suppliers, setSuppliers] = useState([]);
    const [filter, setFilter] = useState('');
    const [supplier, setSupplier] = useState({});
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    //Abrir modales
    const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);
    const [openEditSupplierModal, setOpenEditSupplierModal] = useState(false);
    const [openSupplierDetailsModal, setOpenSupplierDetailsModal] = useState(false);

    //Cerrar modales
    const handleCloseSupplierDetailsModal = () => {
        setOpenSupplierDetailsModal(false);
        setSelectedSupplier(null);
    }

    const handleCloseAddSupplierModal = () => {
        setOpenAddSupplierModal(false);
    }

    const handleCloseEditSupplierModal = () => {
        setOpenEditSupplierModal(false);
    }

    const handleOpenSupplierDetails = (supplier) => () => {
        setSelectedSupplier(supplier);
        setOpenSupplierDetailsModal(true);
    }

    const handleOpenEditSupplier = (supplier) => (e) => {
        e.stopPropagation();
        setSelectedSupplier(supplier);
        setOpenEditSupplierModal(true);
    }

    const filteredSuppliers = suppliers.filter((supplier) => {
        const wordsFilter = filter.toLowerCase().split(' ');

        return wordsFilter.every((word) =>
            supplier.supplier_name.toLowerCase().includes(word) ||
            supplier.supplier_ruc.toLowerCase().includes(word)
        )
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
            toast.error('Error al cargar los proveedores')
        }
    }

    const addSupplier = async (supplier) => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/supplier`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: token
            },
            body: JSON.stringify(supplier)
        })
        const data = await res.json();
        if (res.ok) {
            toast.success('Proveedor agregado correctamente');
            setSupplier({});
            handleCloseAddSupplierModal();
            loadSuppliers();
        } else {
            toast.error('Error al agregar el proveedor');
        }
    }

    const editSupplier = async (supplier) => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/supplier/${supplier.supplier_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                token: token
            },
            body: JSON.stringify(supplier)
        })
        const data = await res.json();
        if (res.ok) {
            toast.success('Proveedor actualizado correctamente');
            handleCloseEditSupplierModal();
            loadSuppliers();
        } else {
            toast.error('Error al actualizar el proveedor')
        }
    }

    const deleteSupplier = async (supplier_id) => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/supplier/${supplier_id}`, {
            method: 'DELETE',
            headers: {
                token: token
            }
        });

        if (res.ok) {
            toast.success('Proveedor eliminado correctamente');
            loadSuppliers();
        } else {
            const data = await res.json();
            toast.error(data);
        }
    }

    const handleAddSupplierChange = (e) => {
        const { name, value } = e.target;
        setSupplier({ ...supplier, [name]: value });
    }

    const handleEditSupplierChange = (e) => {
        const { name, value } = e.target;
        setSelectedSupplier({ ...selectedSupplier, [name]: value });
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(value);
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" width="100%" height="80%" sx={{ backgroundColor: "gray" }}>
            <h3 style={{ fontWeight: "bold" }}>LISTA DE PROVEEDORES</h3>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" width="80%">
                <Button
                    style={{ marginBottom: "1rem", marginRight: "1rem" }}
                    onClick={() => setOpenAddSupplierModal(true)}
                >
                    Agregar proveedor
                </Button>
                <TextField
                    label="Buscar proveedor"
                    variant="outlined"
                    style={{ marginBottom: "1rem", width: "60%" }}
                    value={filter}
                    onChange={handleFilterChange}
                    name="filter"
                />
            </Box>

            <TableContainer
                component={Paper}
                style={{
                    width: "90%",
                    maxHeight: "70vh",
                    overflowY: "scroll",
                    overflowX: "scroll",
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ backgroundColor: "rgb(204, 204, 204)" }}>Nombre</TableCell>
                            <TableCell style={{ backgroundColor: "rgb(204, 204, 204)" }}>RUC</TableCell>
                            <TableCell style={{ backgroundColor: "rgb(204, 204, 204)" }}>Dirección</TableCell>
                            <TableCell style={{ backgroundColor: "rgb(204, 202, 204)" }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSuppliers.map((supplier) => (
                            <TableRow
                                key={supplier.supplier_id}
                                onClick={handleOpenSupplierDetails(supplier)}
                                style={{ cursor: "pointer" }}
                            >
                                <TableCell>{supplier.supplier_name}</TableCell>
                                <TableCell>{supplier.supplier_ruc}</TableCell>
                                <TableCell>{supplier.supplier_address}</TableCell>
                                <TableCell>
                                    <Button
                                        style={{ marginRight: "1rem" }}
                                        onClick={handleOpenEditSupplier(supplier)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        style={{ marginRight: "1rem" }}
                                        onClick={(e) => { e.stopPropagation(); deleteSupplier(supplier.supplier_id) }}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal open={openAddSupplierModal} onClose={handleCloseAddSupplierModal}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "60%",
                        bgcolor: "rgb(204, 204, 204)",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "5px"
                    }}
                >
                    <h3 style={{ width: "100%", textAlign: "center", marginBottom: "1rem" }}>Agregar proveedor</h3>
                    <h4 style={{ width: "100%", textAlign: "center", marginBottom: "1rem" }}>Información general</h4>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            <TextField
                                label="Nombre del proveedor"
                                variant="outlined"
                                style={{ marginBottom: "1rem", marginRight: "2rem", width: "40%" }}
                                value={supplier.supplier_name}
                                onChange={handleAddSupplierChange}
                                name="supplier_name"
                            />
                            <TextField
                                label="RUC"
                                variant="outlined"
                                style={{ marginBottom: "1rem", width: "40%" }}
                                value={supplier.supplier_ruc}
                                onChange={handleAddSupplierChange}
                                name="supplier_ruc"
                            />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            <TextField
                                label="Dirección"
                                variant="outlined"
                                style={{ marginBottom: "1rem", width: "40%" }}
                                value={supplier.supplier_address}
                                onChange={handleAddSupplierChange}
                                name="supplier_address"
                            />
                        </Box>
                        <Button style={{ marginBottom: "1rem" }} onClick={() => addSupplier(supplier)}>Guardar proveedor</Button>
                        <Button onClick={handleCloseAddSupplierModal}>Cancelar</Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={openEditSupplierModal} onClose={handleCloseEditSupplierModal}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "60%",
                        bgcolor: "rgb(204, 204, 204)",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "5px"
                    }}
                >
                    <h3 style={{ width: "100%", textAlign: "center", marginBottom: "1rem" }}>Editar proveedor</h3>
                    <h4 style={{ width: "100%", textAlign: "center", marginBottom: "1rem" }}>Información general</h4>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            <TextField
                                label="Nombre del proveedor"
                                variant="outlined"
                                style={{ marginBottom: "1rem", marginRight: "2rem", width: "40%" }}
                                value={selectedSupplier?.supplier_name || ''}
                                onChange={handleEditSupplierChange}
                                name="supplier_name"
                            />
                            <TextField
                                label="RUC"
                                variant="outlined"
                                style={{ marginBottom: "1rem", width: "40%" }}
                                value={selectedSupplier?.supplier_ruc || ''}
                                onChange={handleEditSupplierChange}
                                name="supplier_ruc"
                            />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            <TextField
                                label="Dirección"
                                variant="outlined"
                                style={{ marginBottom: "1rem", width: "40%" }}
                                value={selectedSupplier?.supplier_address || ''}
                                onChange={handleEditSupplierChange}
                                name="supplier_address"
                            />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <Button style={{ marginRight: "1rem" }} onClick={() => editSupplier(selectedSupplier)}>Guardar proveedor</Button>
                            <Button onClick={handleCloseEditSupplierModal}>Cancelar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Modal open={openSupplierDetailsModal} onClose={handleCloseSupplierDetailsModal}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "60%",
                        bgcolor: "rgb(204, 204, 204)",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "5px"
                    }}
                >
                    <h3 style={{ width: "100%", textAlign: "center", marginBottom: "1rem" }}>Detalles del proveedor</h3>
                    <h4 style={{ width: "100%", textAlign: "center", marginBottom: "1rem" }}>Información general</h4>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "left",
                                width: "50%"
                            }}
                        >
                            <p><span style={{ fontWeight: "bold" }}>Nombre del proveedor: </span>{selectedSupplier?.supplier_name}</p>
                            <p><span style={{ fontWeight: "bold" }}>RUC del proveedor: </span>{selectedSupplier?.supplier_ruc}</p>
                            <p><span style={{ fontWeight: "bold" }}>Dirección: </span>{selectedSupplier?.supplier_address}</p>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "left",
                                width: "50%"
                            }}
                        >
                            <p><span style={{ fontWeight: "bold" }}>Teléfono: </span>{selectedSupplier?.supplier_phone}</p>
                            <p><span style={{ fontWeight: "bold" }}>Correo: </span>{selectedSupplier?.supplier_email}</p>
                            <p><span style={{ fontWeight: "bold" }}>Cuenta bancaria: </span>{selectedSupplier?.supplier_bankaccount}</p>
                        </Box>
                    </Box>
                    <Button onClick={handleCloseSupplierDetailsModal} style={{ width: "5rem" }}>Cerrar</Button>
                </Box>
            </Modal>
        </Box>
    )
}
export default Supplier;
