import { Autocomplete, Box, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { toast } from 'react-toastify';

import config from '../config';
import Cookies from 'js-cookie';

const Quotation = () => {

    const [openAddQuotationModal, setOpenAddQuotationModal] = useState(false);
    const [costCenters, setCostCenters] = useState([]);
    const [areas, setAreas] = useState([]);
    const [quotations, setQuotations] = useState([]);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [openQuotationDetailModal, setOpenQuotationDetailModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadCostoCenters();
        loadAreas();
        loadQuotations();
    }, [])

    const loadCostoCenters = async () => {
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
            toast.error('Error al cargar los datos de centros de costos.')
        }
    }

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
            toast.error('Error al cargar los datos de áreas.')
        }
    }

    const loadQuotations = async () => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/area-quotations`, {
            headers: {
                token: token
            }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
            setQuotations(data);
        } else {
            toast.error('Error al cargar las cotizaciones.');
        };
    };

    const loadItemsFromQuotation = async (quotationId) => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/items/${quotationId}`, {
            headers: {
                token: token
            }
        });
        const data = await res.json();
        if (res.ok) {
            return data;
        } else {
            toast.error(data);
        }
    }

    const deleteQuotation = async (quotationId) => {
        const token = Cookies.get('token');
        const res = await fetch(`${config.apiBaseUrl}/quotation/${quotationId}`, {
            method: 'DELETE',
            headers: {
                token: token
            }
        })
        const data = await res.json();
        console.log(res);
        if (res.ok) {
            toast.success('Cotización eliminada exitosamente.');
            loadQuotations();
        } else {
            toast.error(data);
        }
    }

    const handleRowClick = async (quotation) => {
        setSelectedQuotation(quotation);
        setOpenQuotationDetailModal(true);
    }

    const handleCloseQuotationDetailModal = () => {
        setOpenQuotationDetailModal(false);
    }

    const handleCloseAddQuotationModal = () => {
        setOpenAddQuotationModal(false);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
            sx={{ backgroundColor: "gray" }}
        >
            <h1>Cotizaciones</h1>
            <Button
                onClick={() => navigate(`/newquotation`)}
            >
                Agregar una nueva cotización
            </Button>
            <TableContainer component={Paper} style={{ width: "80%", maxHeight: 300, overflowX: "scroll", overflowY: "scroll", marginTop: "1rem" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Centro de costos</TableCell>
                            <TableCell>Área</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {quotations.map((quotation) => (
                            <TableRow
                                key={quotation.quotation_id}
                                onClick={() => handleRowClick(quotation)}
                                style={{ cursor: "pointer" }}
                            >
                                <TableCell>{new Date(quotation.quotation_date).toLocaleDateString('en-CA')}</TableCell>
                                <TableCell>{quotation.costcenter_name}</TableCell>
                                <TableCell>{quotation.area_name}</TableCell>
                                <TableCell>{quotation.quotation_status}</TableCell>
                                <TableCell>{quotation.quotation_total}</TableCell>
                                <TableCell>
                                    <Button
                                        style={{ marginRight: ".5rem" }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        onClick={() => deleteQuotation(quotation.quotation_id)}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={openQuotationDetailModal}
                onClose={handleCloseQuotationDetailModal}
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
                    <h1 style={{ textAlign: "center" }}>Detalle de la cotización</h1>
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        width="100%"
                    >
                        <p style={{ marginRight: "1rem" }}><span>Fecha de la cotización: </span>{selectedQuotation.quotation_date}</p>
                        <p><span>Centro de costos: </span>{selectedQuotation.costcenter_name}</p>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

export default Quotation;