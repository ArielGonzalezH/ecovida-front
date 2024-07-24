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

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState(null);
  const [user_name, setUserName] = useState("");
  const [user_lastname, setUserLastName] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [user_password, setUserPassword] = useState("");
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  const handleAddUser = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch("http://localhost/api/users/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
        },
        body: JSON.stringify({
          role_id: role?.role_id,
          user_name: user_name,
          user_lastname: user_lastname,
          user_email: user_email,
          user_password: user_password,
        }),
      });

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      toast.success("Usuario creado exitosamente.");
      setOpenAddUserModal(false);
      resetAddUserFields();
      loadUsers();
    } catch (error) {
      toast.error("Error al crear el usuario.");
    }
  };

  const handleEditUser = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(
        `http://localhost/api/users/usuarios/${selectedUser.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
          body: JSON.stringify({
            role_id: role?.role_id,
            user_name: user_name,
            user_lastname: user_lastname,
            user_email: user_email,
            user_password: user_password,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      toast.success("Usuario editado exitosamente.");
      setOpenEditUserModal(false);
      resetEditUserFields();
      loadUsers();
    } catch (error) {
      toast.error("Error al editar el usuario.");
    }
  };

  const handleOpenEditUser = (user) => {
    setSelectedUser(user);
    setRole(roles.find((role) => role.role_id === user.role_id)); // Configura el rol seleccionado
    setUserName(user.user_name);
    setUserLastName(user.user_lastname);
    setUserEmail(user.user_email);
    setUserPassword(user.user_password);
    setOpenEditUserModal(true);
  };

  const resetAddUserFields = () => {
    setRole(null);
    setUserName("");
    setUserLastName("");
    setUserEmail("");
    setUserPassword("");
  };

  const resetEditUserFields = () => {
    setRole(null);
    setUserName("");
    setUserLastName("");
    setUserEmail("");
    setUserPassword("");
    setSelectedUser(null);
  };

  const loadUsers = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch("http://localhost/api/users/usuarios", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("Error en la respuesta del servidor ", res);
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        // Mapea los usuarios a los nombres de roles
        const usersWithRoleNames = data.map((user) => ({
          ...user,
          role_name:
            roles.find((role) => role.role_id === user.role_id)?.role_name ||
            "Desconocido",
        }));
        setUsers(usersWithRoleNames);
        setFilteredUsers(usersWithRoleNames); // Inicialmente, el estado de usuarios filtrados es igual al de usuarios
      } else {
        toast.error("Error al cargar los usuarios");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadRoles = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch("http://localhost/api/roles/roles", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("Error en la respuesta del servidor ", res);
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setRoles(data);
      } else {
        toast.error("Error al cargar los roles");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`http://localhost/api/users/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      toast.success("Usuario eliminado exitosamente.");
      loadUsers();
    } catch (error) {
      toast.error("Error al eliminar el usuario.");
    }
  };

  const filterUsers = (term) => {
    const lowerCaseTerm = term.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.user_name.toLowerCase().includes(lowerCaseTerm) ||
        user.user_lastname.toLowerCase().includes(lowerCaseTerm) ||
        user.user_email.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    loadRoles(); // Cargar roles primero para asegurarse de que están disponibles para mapear
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      loadUsers();
    }
  }, [roles]);

  useEffect(() => {
    filterUsers(searchTerm); // Filtrar usuarios cuando el término de búsqueda cambia
  }, [searchTerm, users]);

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
      <h1>Usuarios</h1>
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
          onClick={() => setOpenAddUserModal(true)}
        >
          Crear nuevo usuario
        </Button>
        <TextField
          id="outlined-basic"
          label="Buscar usuario"
          variant="outlined"
          sx={{ margin: 1 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado de búsqueda
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
              <TableCell>Rol</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.role_name}</TableCell>
                <TableCell>{user.user_name}</TableCell>
                <TableCell>{user.user_lastname}</TableCell>
                <TableCell>{user.user_email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenEditUser(user)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteUser(user.user_id)}
                    sx={{ marginLeft: 1 }}
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
        open={openAddUserModal}
        onClose={() => setOpenAddUserModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Agregar Usuario</h2>
          <TextField
            id="user_name"
            label="Nombre"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            id="user_lastname"
            label="Apellido"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={user_lastname}
            onChange={(e) => setUserLastName(e.target.value)}
          />
          <TextField
            id="user_email"
            label="Correo"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={user_email}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <TextField
            id="user_password"
            label="Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={user_password}
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <Autocomplete
            options={roles}
            getOptionLabel={(option) => option.role_name}
            onChange={(event, newValue) => setRole(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Rol"
                variant="outlined"
                fullWidth
              />
            )}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddUser}
          >
            Agregar
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openEditUserModal}
        onClose={() => setOpenEditUserModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Editar Usuario</h2>
          <TextField
            id="user_name"
            label="Nombre"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            id="user_lastname"
            label="Apellido"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={user_lastname}
            onChange={(e) => setUserLastName(e.target.value)}
          />
          <TextField
            id="user_email"
            label="Correo"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={user_email}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <TextField
            id="user_password"
            label="Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={user_password}
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <Autocomplete
            options={roles}
            getOptionLabel={(option) => option.role_name}
            value={role}
            onChange={(event, newValue) => setRole(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Rol"
                variant="outlined"
                fullWidth
              />
            )}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditUser}
          >
            Editar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UsersList;