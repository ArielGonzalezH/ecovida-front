import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import FindFundation from "./pages/find_fundation";
import "./App.css";

function App() {
  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/find_fundation" element={<FindFundation />} />
        </Routes>
      </div>
      </Router>
    </>
  );
}

export default App;
