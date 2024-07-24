import { NavLink } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";

const Sidebar = ({ toggleSidebar, isVisible }) => {
  return (
    <div
      className={`sidebar bg-light ${isVisible ? "visible" : "hidden"}`}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <button
        onClick={toggleSidebar}
        className={`toggle-button ${isVisible ? "" : "collapsed"}`}
      >
        {isVisible ? <AiIcons.AiOutlineClose /> : <FaIcons.FaBars />}
      </button>
      <ul>
        <li>
          <NavLink
            to="/home"
            className="text-dark rounded py-2 w-100 d-inline-block px-3"
            exact
            activeClassName="active"
          >
            <FaIcons.FaHome className="icon" />{" "}
            <span className="text">Inicio</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/users"
            className="text-dark rounded py-2 w-100 d-inline-block px-3"
            exact
            activeClassName="active"
          >
            <FaIcons.FaHome className="icon" />{" "}
            <span className="text">Usuarios</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/foundations-list"
            className="text-dark rounded py-2 w-100 d-inline-block px-3"
            exact
            activeClassName="active"
          >
            <FaIcons.FaHome className="icon" />{" "}
            <span className="text">Fundaciones</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/home-foundation"
            className="text-dark rounded py-2 w-100 d-inline-block px-3"
            exact
            activeClassName="active"
          >
            <FaIcons.FaClipboardList className="icon" />{" "}
            <span className="text">Inicio Fundacion</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products-list"
            className="text-dark rounded py-2 w-100 d-inline-block px-3"
            exact
            activeClassName="active"
          >
            <FaIcons.FaClipboardList className="icon" />{" "}
            <span className="text">Lista de Productos</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/foundations-client"
            className="text-dark rounded py-2 w-100 d-inline-block px-3"
            exact
            activeClassName="active"
          >
            <FaIcons.FaClipboardList className="icon" />{" "}
            <span className="text">Fundaciones cliente</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
