import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.scss';

import config from "../src/config";

import Home from './pages/Home';
import Login from './pages/Login';
import NewQuotation from './pages/NewQuotation';
import Products from './pages/Products';
import PurchaseOrder from './pages/PurchaseOrder';
import Quotation from './pages/Quotation';
import Supplier from './pages/Supplier';
import FoundationsList from './pages/FoundationsList';
import WelcomeView from './pages/WelcomeView';
import Prueba from './pages/Prueba';
import ProductList from './pages/ProductList';

import NavbarNav from './components/NavbarNav';
import Sidebar from './components/Sidebar';
import SidebarFundations from './components/SidebarFundations';
import ProductCard from './components/ProductCard';

import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch(`${config.apiBaseUrl}/is-verify`, {
        method: "GET",
        headers: { token: Cookies.get('token') }
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        const decodedToken = jwtDecode(Cookies.get('token'));
        const userType = decodedToken.type;
        setIsAuthenticated(true);
        setUserType(userType);
      } else {
        setIsAuthenticated(false);
        setUserType(null);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    isAuth();
  }, [Cookies.get('token')]);

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

function AppContent({ isAuthenticated, setAuth, authChecked, handleLogin, sidebarVisible, toggleSidebar }) {
  const location = useLocation();

  return (
    <div className="flex">
      {isAuthenticated && <Sidebar isVisible={sidebarVisible} toggleSidebar={toggleSidebar} />}
      <div className={`content w-100 ${sidebarVisible ? 'expanded' : 'collapsed'}`}>
        {isAuthenticated && <NavbarNav />}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home setAuth={setAuth} /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to={location.state?.from || '/'} replace />} />
          <Route path='/home' element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
          <Route path='/prueba' element={isAuthenticated ? <Prueba /> : <Navigate to="/" />} />
          <Route path='/home-foundation' element={isAuthenticated ? <WelcomeView/> : <Navigate to="/" />} />
          <Route path='/products' element={isAuthenticated ? <Products /> : <Navigate to="/" />} />
          <Route path='/purchaseorder' element={isAuthenticated ? <PurchaseOrder /> : <Navigate to="/" />} />
          <Route path='/quotation' element={isAuthenticated ? <Quotation /> : <Navigate to='/' />} />
          <Route path='/newquotation' element={isAuthenticated ? <NewQuotation /> : <Navigate to='/' />} />
          <Route path='/supplier' element={isAuthenticated ? <Supplier /> : <Navigate to='/' />} />
          <Route path='/foundations-list' element={isAuthenticated ? <FoundationsList /> : <Navigate to='/' />} />
          <Route path='/productlist' element={isAuthenticated ? <ProductList /> : <Navigate to='/' />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;