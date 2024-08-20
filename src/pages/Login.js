import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import React, { Fragment, useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from "react-toastify";
import logo from '../assets/images.png';
import Cookies from 'js-cookie'

const Login = ({ setAuth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [inputs, setInputs] = useState({
    user_email: "",
    user_password: ""
  });

  const { user_email, user_password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { user_email, user_password };

      const response = await fetch(`http://localhost/api/users/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        Cookies.set("token", parseRes.token, { expires: 1 });
        Cookies.set("user", JSON.stringify(parseRes.usuario));

        setAuth(true);

        toast.success("¡Inicio de sesión exitoso!");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (error) {
      toast.error("¡Error al iniciar sesión!");
    }
  }

  return (
    <Fragment>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", height: "100%", backgroundColor: "rgb(240, 242, 245)" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "55%", max: "100%" }}>
          <img src={logo} alt="description" style={{ width: "50%" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "45%", height: "100%" }}>
          <form style={{ display: "flex", backgroundColor: "white", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "80%", height: "50%", borderRadius: "2%", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)" }} onSubmit={onSubmitForm}>
            <TextField
              required
              name="user_email"
              value={user_email}
              onChange={e => onChange(e)}
              sx={{ margin: ".5rem .5rem", width: "80%" }}
              id="outlined-required"
              label="Correo electrónico"
            />
            <FormControl sx={{ m: 1, width: "80%" }} variant="outlined">
              <InputLabel required htmlFor="outlined-adornment-password">Contraseña</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name="user_password"
                value={user_password}
                onChange={e => onChange(e)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              sx={{ margin: ".5rem .5rem", width: "80%" }}
            >
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default Login;