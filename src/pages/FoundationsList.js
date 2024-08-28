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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import config from "../config";

const Foundations = () => {
  const [openAddFoundationModal, setOpenAddFoundationModal] = useState(false);
  const [openEditFoundationModal, setOpenEditFoundationModal] = useState(false);

  const [foundations, setFoundations] = useState([]);
  const [filteredFoundations, setFilteredFoundations] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [foundationName, setFoundationName] = useState("");
  const [foundationRuc, setFoundationRuc] = useState("");
  const [role_id, setRole] = useState(null);
  const [user_name, setUserName] = useState("");
  const [user_lastname, setUserLastName] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [user_password, setUserPassword] = useState("");
  const [selectedFoundation, setSelectedFoundation] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  const loadRoles = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${config.apiBaseUrl}/api/roles/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setRoles(data);
      } else {
        toast.error("Error al cargar los datos de roles.");
      }
    } catch (error) {
      toast.error("Error al cargar los datos de roles.");
    }
  };

  const loadUsers = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${config.apiBaseUrl}/api/users/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
        console.log(data);
        const userMap = data.reduce((map, user) => {
          map[user.user_id] = user.user_email;
          return map;
        }, {});
        setUserMap(userMap);
      } else {
        toast.error("Error al cargar los datos de usuarios.");
      }
    } catch (error) {
      toast.error("Error al cargar los datos de usuarios.");
    }
  };

  const loadFoundations = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${config.apiBaseUrl}/api/foundations/foundations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        const mappedFoundations = data.map((foundation) => ({
          ...foundation,
          user_email: userMap[foundation.user_id] || "Usuario no encontrado",
        }));
        setFoundations(mappedFoundations);
        setFilteredFoundations(mappedFoundations); // Establecer las fundaciones filtradas inicialmente
      } else {
        toast.error("Error al cargar los datos de fundaciones.");
      }
    } catch (error) {
      toast.error("Error al cargar los datos de fundaciones.");
    }
  };

  const handleCreateFoundation = async () => {
    if (!selectedUser || !foundationName || !foundationRuc) {
      toast.error("Todos los campos son requeridos.");
      return;
    }

    const token = Cookies.get("token");
    try {
      const res = await fetch(`${config.apiBaseUrl}/api/foundations/foundations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: selectedUser.user_id,
          found_name: foundationName,
          found_ruc: foundationRuc,
        }),
      });

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      toast.success("Fundación creada exitosamente.");
      handleCloseAddFoundationModal(); // Reset fields when closing the modal
      loadFoundations();
    } catch (error) {
      toast.error("Error al crear la fundación.");
    }
  };

  const deleteFoundation = async (found_id) => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(
        `${config.apiBaseUrl}/api/foundations/foundations/${found_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      toast.success("Fundación eliminada exitosamente.");
      loadFoundations();
    } catch (error) {
      toast.error("Error al eliminar la fundación.");
    }
  };

  const handleEditFoundation = (foundation) => {
    setSelectedFoundation(foundation);
    setFoundationName(foundation.found_name);
    setFoundationRuc(foundation.found_ruc);
    setOpenEditFoundationModal(true);
  };

  const handleUpdateFoundation = async () => {
    if (!foundationName || !foundationRuc) {
      toast.error("Todos los campos son requeridos.");
      return;
    }

    const token = Cookies.get("token");
    try {
      const res = await fetch(`${config.apiBaseUrl}/api/foundations/foundations/${selectedFoundation.found_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          found_name: foundationName,
          found_ruc: foundationRuc,
        }),
      });

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      toast.success("Fundación actualizada exitosamente.");
      handleCloseEditFoundationModal(); // Reset fields when closing the modal
      loadFoundations();
    } catch (error) {
      toast.error("Error al actualizar la fundación.");
    }
  };

  const handleCloseAddFoundationModal = () => {
    setOpenAddFoundationModal(false);
    setFoundationName("");
    setFoundationRuc("");
    setSelectedUser(null);
  };

  const handleCloseEditFoundationModal = () => {
    setOpenEditFoundationModal(false);
    setFoundationName("");
    setFoundationRuc("");
    setSelectedFoundation(null);
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

  useEffect(() => {
    const filtered = foundations.filter((foundation) =>
      foundation.found_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      foundation.found_ruc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoundations(filtered);
  }, [searchTerm, foundations]);

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
      <h1>Fundaciones</h1>
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
          sx={{ display: "inline-block", width: "auto", margin: ".5rem .5rem" }}
          onClick={() => setOpenAddFoundationModal(true)}
        >
          Crear fundación
        </Button>
        <TextField
          required
          sx={{ margin: ".5rem .5rem" }}
          id="search"
          label="Buscar fundación"
          variant="outlined"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <TableContainer component={Paper} sx={{ width: "90%", margin: "1rem auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>RUC</TableCell>
              <TableCell>Correo del Usuario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFoundations.map((foundation) => (
              <TableRow key={foundation.found_id}>
                <TableCell>{foundation.found_name}</TableCell>
                <TableCell>{foundation.found_ruc}</TableCell>
                <TableCell>{foundation.user_email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditFoundation(foundation)}
                    sx={{ marginRight: "1rem" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteFoundation(foundation.found_id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={openAddFoundationModal} onClose={handleCloseAddFoundationModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Agregar Fundación</h2>
          <Autocomplete
            disablePortal
            id="user-autocomplete"
            options={users}
            getOptionLabel={(option) => option.user_email}
            onChange={(event, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Usuario" variant="outlined" required />
            )}
          />
          <TextField
            sx={{ marginTop: "1rem" }}
            id="foundation-name"
            label="Nombre de Fundación"
            variant="outlined"
            value={foundationName}
            onChange={(e) => setFoundationName(e.target.value)}
            required
          />
          <TextField
            sx={{ marginTop: "1rem" }}
            id="foundation-ruc"
            label="RUC de Fundación"
            variant="outlined"
            value={foundationRuc}
            onChange={(e) => setFoundationRuc(e.target.value)}
            required
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: "1rem" }}
            onClick={handleCreateFoundation}
          >
            Crear Fundación
          </Button>
        </Box>
      </Modal>
      <Modal open={openEditFoundationModal} onClose={handleCloseEditFoundationModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Editar Fundación</h2>
          <TextField
            sx={{ marginTop: "1rem" }}
            id="edit-foundation-name"
            label="Nombre de Fundación"
            variant="outlined"
            value={foundationName}
            onChange={(e) => setFoundationName(e.target.value)}
            required
          />
          <TextField
            sx={{ marginTop: "1rem" }}
            id="edit-foundation-ruc"
            label="RUC de Fundación"
            variant="outlined"
            value={foundationRuc}
            onChange={(e) => setFoundationRuc(e.target.value)}
            required
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: "1rem" }}
            onClick={handleUpdateFoundation}
          >
            Actualizar Fundación
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Foundations;