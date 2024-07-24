import React from 'react';
import { NavLink } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Drawer } from '@mui/material';

const SidebarFundations = ({ toggleSidebar, isVisible }) => {
    const drawerWidth = 240;

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={isVisible}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Box
                sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}
            >
                <IconButton onClick={toggleSidebar}>
                    <AiIcons.AiOutlineClose />
                </IconButton>
            </Box>
            <List>
                <ListItem button component={NavLink} to="/home-foundation" activeClassName='active'>
                    <ListItemIcon>
                        <FaIcons.FaHome />
                    </ListItemIcon>
                    <ListItemText primary="Inicio Fundacion" />
                </ListItem>
                <ListItem button component={NavLink} to="/products" activeClassName='active'>
                    <ListItemIcon>
                        <FaIcons.FaBarcode />
                    </ListItemIcon>
                    <ListItemText primary="Productos" />
                </ListItem>
                <ListItem button component={NavLink} to="/sales" activeClassName='active'>
                    <ListItemIcon>
                        <FaIcons.FaShoppingCart />
                    </ListItemIcon>
                    <ListItemText primary="Ventas" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default SidebarFundations;
