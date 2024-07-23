import { Autocomplete, Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const Foundations = () => {
    const [openAddFoundationModal, setOpenAddFoundationModal] = useState(false);
    const [openAddUserModal, setOpenAddUserModal] = useState(false);

    const [foundations, setFoundations] = useState([]);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [userMap, setUserMap] = useState({}); // Mapa de usuarios por user_id
    const [selectedUser, setSelectedUser] = useState(null);
    const [foundationName, setFoundationName] = useState('');
    const [foundationRuc, setFoundationRuc] = useState('');

    const loadRoles = async () => {
        const token = Cookies.get('token');
        try {
            const res = await fetch('http://localhost/api/roles/roles', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await res.json();
            if (Array.isArray(data)) {
                setRoles(data);
            } else {
                toast.error('Error al cargar los datos de roles.');
            }
        } catch (error) {
            toast.error('Error al cargar los datos de roles.');
        }
    };

    const loadUsers = async () => {
        const token = Cookies.get('token');
        try {
            const res = await fetch(`http://localhost/api/users/usuarios`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);

                // Crear un mapa de user_id a user_email
                const userMap = data.reduce((map, user) => {
                    map[user.user_id] = user.user_email;
                    return map;
                }, {});

                setUserMap(userMap);
            } else {
                toast.error('Error al cargar los datos de usuarios.');
            }
        } catch (error) {
            toast.error('Error al cargar los datos de usuarios.');
        }
    };

    const loadFoundations = async () => {
        const token = Cookies.get('token');
        try {
            const res = await fetch('http://localhost/api/foundations/foundations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await res.json();
            if (Array.isArray(data)) {
                // Mapear fundaciones y agregar el email del usuario
                const mappedFoundations = data.map(foundation => ({
                    ...foundation,
                    user_email: userMap[foundation.user_id] || 'Usuario no encontrado'
                }));
                setFoundations(mappedFoundations);
            } else {
                toast.error('Error al cargar los datos de fundaciones.');
            }
        } catch (error) {
            toast.error('Error al cargar los datos de fundaciones.');
        }
    };

    const handleCreateFoundation = async () => {
        if (!selectedUser || !foundationName || !foundationRuc) {
            toast.error('Todos los campos son requeridos.');
            return;
        }

        const token = Cookies.get('token');
        try {
            const res = await fetch('http://localhost/api/foundations/foundations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: selectedUser.user_id,
                    found_name: foundationName,
                    found_ruc: foundationRuc
                })
            });

            if (!res.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            toast.success('Fundación creada exitosamente.');
            setOpenAddFoundationModal(false);
            loadFoundations(); // Recargar las fundaciones después de crear una nueva
        } catch (error) {
            toast.error('Error al crear la fundación.');
        }
    };

    useEffect(() => {
        loadUsers();
        loadRoles();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            loadFoundations();
        }
    }, [users]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "rgb(240, 242, 245)"
            }}
        >
            <h1>Foundations</h1>
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
                    sx={{ margin: ".5rem .5rem" }}
                    onClick={() => setOpenAddUserModal(true)}
                >
                    Usuarios
                </Button>
                <Button
                    variant="contained"
                    sx={{ display: "inline-block", width: "auto", margin: ".5rem .5rem" }}
                    onClick={() => setOpenAddFoundationModal(true)}
                >
                    Crear fundación
                </Button>
                <TextField
                    required
                    sx={{ margin: ".5rem .5rem", width: "80%" }}
                    id="outlined-required"
                    label="Buscar"
                />
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    width: "80%", maxHeight: 300, overflowX: "scroll", overflowY: "scroll", marginTop: "1rem"
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>RUC</TableCell>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {foundations.map((foundation) => (
                            <TableRow key={foundation.found_id}>
                                <TableCell>{foundation.found_name}</TableCell>
                                <TableCell>{foundation.found_ruc}</TableCell>
                                <TableCell>{foundation.user_email}</TableCell>
                                <TableCell>
                                    <Button
                                        style={{ marginRight: ".5rem" }}
                                    >
                                        Editar
                                    </Button>
                                    <Button>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={openAddFoundationModal}
                onClose={() => setOpenAddFoundationModal(false)}
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
                    <h1>Crear fundación</h1>
                    <Autocomplete
                        sx={{ margin: ".5rem .5rem", width: "80%" }}
                        options={users}
                        getOptionLabel={(option) => option.user_email}
                        onChange={(event, newValue) => setSelectedUser(newValue)}
                        renderInput={(params) => <TextField {...params} label="Usuario" />}
                    />
                    <TextField
                        required
                        sx={{ margin: ".5rem .5rem", width: "80%" }}
                        id="foundation-name"
                        label="Nombre de la fundación"
                        value={foundationName}
                        onChange={(e) => setFoundationName(e.target.value)}
                    />
                    <TextField
                        required
                        sx={{ margin: ".5rem .5rem", width: "80%" }}
                        id="foundation-ruc"
                        label="RUC de la fundación"
                        value={foundationRuc}
                        onChange={(e) => setFoundationRuc(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        sx={{ margin: ".5rem .5rem" }}
                        onClick={handleCreateFoundation}
                    >
                        Crear
                    </Button>
                </Box>
            </Modal>
            <Modal
                open={openAddUserModal}
                onClose={() => setOpenAddUserModal(false)}
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
                    <h1>Crear nuevo usuario</h1>
                    <Autocomplete
                        sx={{ margin: ".5rem .5rem", width: "80%" }}
                        options={roles}
                        getOptionLabel={(option) => option.role_name}
                        renderInput={(params) => <TextField {...params} label="Rol" />}
                    />
                    <TextField
                        required
                        sx={{ margin: ".5rem .5rem", width: "80%" }}
                        id="outlined-required"
                        label="Nombre"
                    />
                    <TextField
                        required
                        sx={{ margin: ".5rem .5rem", width: "80%" }}
                        id="outlined-required"
                        label="Apellido"
                    />
                    <TextField
                        required
                        sx={{ margin: ".5rem .5rem", width: "80%" }}
                        id="outlined-required"
                        label="Email"
                    />
                    <TextField
                        required
                        sx={{ margin: ".5rem .5rem", width: "80%" }}
                        id="outlined-required"
                        label="Contraseña"
                    />
                    <Button
                        variant="contained"
                        sx={{ margin: ".5rem .5rem" }}
                    >
                        Crear
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default Foundations;
