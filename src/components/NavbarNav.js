import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Cookies from 'js-cookie';

function NavbarNav(args) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    
    window.location.reload();
  };

  return (
    <div>
      <Navbar {...args}>
        <NavbarBrand href="/"><span style={{ fontWeight: "bold" }}>ECOVIDA</span></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Nombre perfil
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem>Mi perfil</DropdownItem>
                <DropdownItem>Configuraciones</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={handleLogout}>Cerrar sesión</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavbarNav;
