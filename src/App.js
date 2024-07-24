import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.scss";

import config from "../src/config";

import Home from "./pages/Home";
import Login from "./pages/Login";
import UsersList from "./pages/UsersList";
import FoundationsList from "./pages/FoundationsList";
import FoundationsClient from "./pages/FoundationsClient";

import NavbarNav from "./components/NavbarNav";
import Sidebar from "./components/Sidebar";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WelcomeView from "./pages/WelcomeView";
import ProductList from "./pages/ProductList";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    const token = Cookies.get("token");
    console.log("Token:", token);
    if (!token) {
      setIsAuthenticated(false);
      setUserType(null);
      setAuthChecked(true);
      return;
    }

    try {
      console.log("Verificando autenticación...");
      const response = await fetch(`http://localhost/api/users/is-verify`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.log("Error en la respuesta del servidor ", response);
        throw new Error("Error en la respuesta del servidor");
      }

      const parseRes = await response.json();
      console.log("Respuesta de verificación:", parseRes);

      if (parseRes === true) {
        const decodedToken = jwtDecode(token);
        const userType = decodedToken.type;
        setIsAuthenticated(true);
        setUserType(userType);
      } else {
        setIsAuthenticated(false);
        setUserType(null);
      }
    } catch (error) {
      console.error(
        "Error en la verificación de autenticación:",
        error.message
      );
      setIsAuthenticated(false);
      setUserType(null);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    isAuth();
  }, [Cookies.get("token")]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setAuth={setAuth}
        authChecked={authChecked}
        handleLogin={handleLogin}
        sidebarVisible={sidebarVisible}
        toggleSidebar={toggleSidebar}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

function AppContent({
  isAuthenticated,
  setAuth,
  authChecked,
  handleLogin,
  sidebarVisible,
  toggleSidebar,
}) {
  const location = useLocation();

  return (
    <div className="flex">
      {isAuthenticated && (
        <Sidebar isVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
      )}
      <div
        className={`content w-100 ${sidebarVisible ? "expanded" : "collapsed"}`}
      >
        {isAuthenticated && <NavbarNav />}
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home setAuth={setAuth} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setAuth={setAuth} />
              ) : (
                <Navigate to={location.state?.from || "/"} replace />
              )
            }
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/" />}
          />
          <Route
            path="/foundations-list"
            element={
              isAuthenticated ? <FoundationsList /> : <Navigate to="/" />
            }
          />
          <Route
            path="/users"
            element={
              isAuthenticated ? <UsersList /> : <Navigate to="/" />
            }
          />
          <Route
            path="/home-foundation"
            element={
              isAuthenticated ? <WelcomeView /> : <Navigate to="/" />
            }
          />
          <Route
            path="/products-list"
            element={
              isAuthenticated ? <ProductList /> : <Navigate to="/" />
            }
          />
          <Route
            path="/foundations-client"
            element={
              isAuthenticated ? <FoundationsClient /> : <Navigate to="/" />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
