import { NavLink } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

const Sidebar = ({ toggleSidebar, isVisible }) => {
    return (
        <div className={`sidebar bg-light ${isVisible ? 'visible' : 'hidden'}`} style={{ display: "flex", flexDirection: "column" }}>
            <button onClick={toggleSidebar} className={`toggle-button ${isVisible ? '' : 'collapsed'}`}>
                {isVisible ? <AiIcons.AiOutlineClose /> : <FaIcons.FaBars />}
            </button>
            <ul>
                <li>
                    <NavLink to="/home" className='text-dark rounded py-2 w-100 d-inline-block px-3' exact activeClassName='active'>
                        <FaIcons.FaHome className='icon' /> <span className='text'>Inicio</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/foundations-list" className='text-dark rounded py-2 w-100 d-inline-block px-3' exact activeClassName='active'>
                        <FaIcons.FaHome className='icon' /> <span className='text'>Fundaciones</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/supplier" className='text-dark rounded py-2 w-100 d-inline-block px-3' exact activeClassName='active'>
                        <FaIcons.FaTruckMoving className='icon' /> <span className='text'>Proveedores</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/products" className='text-dark rounded py-2 w-100 d-inline-block px-3' exact activeClassName='active'>
                        <FaIcons.FaBarcode className='icon' /> <span className='text'>Productos</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/quotation" className='text-dark rounded py-2 w-100 d-inline-block px-3' exact activeClassName='active'>
                        <FaIcons.FaBalanceScaleLeft className='icon' /> <span className='text'>Cotizaciones</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/purchaseorder" className='text-dark rounded py-2 w-100 d-inline-block px-3' exact activeClassName='active'>
                        <FaIcons.FaClipboardList className='icon' /> <span className='text'>Órdenes de compras</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;