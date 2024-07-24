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
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState(null);
  const [user_name, setUserName] = useState("");
  const [user_lastname, setUserLastName] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [user_password, setUserPassword] = useState("");
  const [openAddUserModal, setOpenAddUserModal] = useState(false);

  const handleAddUser = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch("http://localhost/api/users/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      loadUsers();
    } catch (error) {
      toast.error("Error al crear el usuario.");
    }
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
          role_name: roles.find((role) => role.role_id === user.role_id)?.role_name || 'Desconocido',
        }));
        setUsers(usersWithRoleNames);
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
    }
    catch (error) {
      toast.error("Error al eliminar el usuario.");
    }
  };

  useEffect(() => {
    loadRoles(); // Cargar roles primero para asegurarse de que están disponibles para mapear
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      loadUsers();
    }
  }, [roles]);

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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.role_name}</TableCell>
                <TableCell>{user.user_name}</TableCell>
                <TableCell>{user.user_lastname}</TableCell>
                <TableCell>{user.user_email}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" sx={{ marginRight: "1rem"}}>
                    Editar
                  </Button>
                  <Button variant="contained" sx={{bgcolor: "red"}}
                    onClick={() => deleteUser(user.user_id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={openAddUserModal} onClose={() => setOpenAddUserModal(false)}>
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
          <h1>Crear nuevo usuario</h1>
          <Autocomplete
            sx={{ margin: ".5rem .5rem", width: "80%" }}
            options={roles}
            getOptionLabel={(option) => option.role_name}
            renderInput={(params) => <TextField {...params} label="Rol" />}
            onChange={(event, newValue) => setRole(newValue)}
          />
          <TextField
            required
            sx={{ margin: ".5rem .5rem", width: "80%" }}
            id="outlined-required"
            label="Nombre"
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            required
            sx={{ margin: ".5rem .5rem", width: "80%" }}
            id="outlined-required"
            label="Apellido"
            value={user_lastname}
            onChange={(e) => setUserLastName(e.target.value)}
          />
          <TextField
            required
            sx={{ margin: ".5rem .5rem", width: "80%" }}
            id="outlined-required"
            label="Email"
            value={user_email}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <TextField
            required
            sx={{ margin: ".5rem .5rem", width: "80%" }}
            id="outlined-required"
            label="Contraseña"
            value={user_password}
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ margin: ".5rem .5rem" }}
            onClick={handleAddUser}
          >
            Crear
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UsersList;
