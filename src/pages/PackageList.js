import {
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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PackageList = () => {
    const [packages, setPackages] = useState([]);
    const [packageState, setPackageState] = useState("");
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);

    const loadPackages = async () => {
        const token = Cookies.get("token");
        try {
            const response = await fetch("http://localhost/api/packages/package", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch packages");
            const data = await response.json();
            setPackages(data);
        } catch (error) {
            toast.error("Failed to load packages: " + error.message);
        }
    };

    const handleUpdatePackage = async () => {
        const token = Cookies.get("token");
        try {
            const response = await fetch(`http://localhost/api/packages/package/${selectedPackage.package_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ state_package: packageState }),
            });
            if (!response.ok) throw new Error("Failed to update package");
            toast.success("Package updated successfully");
            setOpenEditModal(false);
            loadPackages();
        } catch (error) {
            toast.error("Failed to update package: " + error.message);
        }
    };

    const deletePackage = async (id) => {
        const token = Cookies.get("token");
        try {
            const response = await fetch(`http://localhost/api/packages/package/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to delete package");
            toast.success("Package deleted successfully");
            loadPackages();
        } catch (error) {
            toast.error("Failed to delete package: " + error.message);
        }
    };

    useEffect(() => {
        loadPackages();
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "rgb(240, 242, 245)",
            }}
        >
            <h1>Package Management</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Package ID</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {packages.map((pkg) => (
                            <TableRow key={pkg.package_id}>
                                <TableCell>{pkg.package_id}</TableCell>
                                <TableCell>{pkg.state_package}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            setSelectedPackage(pkg);
                                            setPackageState(pkg.state_package);
                                            setOpenEditModal(true);
                                        }}
                                    >
                                        Actualizar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => deletePackage(pkg.package_id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h2>Actualizar Estado del Paquete</h2>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="package-state-label">Estado</InputLabel>
                        <Select
                            labelId="package-state-label"
                            value={packageState}
                            onChange={(e) => setPackageState(e.target.value)}
                        >
                            <MenuItem value="Verificado">Verificado</MenuItem>
                            <MenuItem value="Enviado">Enviado</MenuItem>
                            <MenuItem value="Entregado">Entregado</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleUpdatePackage}
                    >
                        Update
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default PackageList;
