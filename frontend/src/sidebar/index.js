import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png'
import './index.css'
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Toolbar from '@mui/material/Toolbar';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ListItemButton from '@mui/material/ListItemButton';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Collapse from '@mui/material/Collapse';
import PaymentsIcon from '@mui/icons-material/Payments';
import GavelIcon from '@mui/icons-material/Gavel';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CreateIcon from '@mui/icons-material/Create';
import AddIcon from '@mui/icons-material/Add';
import EventNoteIcon from '@mui/icons-material/EventNote';

const drawerWidth = 240;

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(true);
  const [openRegister, setOpenRegister] = useState(false);

  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
         
          <ListItem button component={Link} to="/" >
            <ListItemIcon>
             <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary="Översikt" />
          </ListItem>

      <ListItemButton onClick={() => {setOpenCreate(!openCreate); setOpenInvoice(false); setOpenRegister(false)}}>
        <ListItemIcon>
        <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Skapa ny" />
        {openCreate ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openCreate} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/skapa-faktura">
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Faktura" />
          </ListItemButton>

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/skapa-avtalsfaktura">
            <ListItemIcon>
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="Avtalsfaktura" />
          </ListItemButton>

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/skapa-massfaktura">
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary="Massfaktura" />
          </ListItemButton>
        </List>
      </Collapse>     

      <ListItemButton onClick={() => {setOpenCreate(false); setOpenInvoice(!openInvoice); setOpenRegister(false)}}>
        <ListItemIcon>
        <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary="Faktura" />
        {openInvoice ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openInvoice} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/faktura">
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary="Översikt" />
          </ListItemButton>

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/betalningar">
            <ListItemIcon>
              <PaymentsIcon />
            </ListItemIcon>
            <ListItemText primary="Betalningar" />
          </ListItemButton>
        </List>
      </Collapse>     

      <ListItemButton onClick={() => {setOpenCreate(false); setOpenInvoice(false); setOpenRegister(!openRegister)}}>
        <ListItemIcon>
        <PlaylistAddIcon />
        </ListItemIcon>
        <ListItemText primary="Register" />
        {openRegister ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
        <Collapse in={openRegister} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/kunder">
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Kunder" />
          </ListItemButton>

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/produkter">
            <ListItemIcon>
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary="Produkter" />
          </ListItemButton>
        </List>
      </Collapse>      

        <ListItem button component={Link} to="/bokforing" >
            <ListItemIcon>
             <GavelIcon />
            </ListItemIcon>
            <ListItemText primary="Bokföring" />
          </ListItem>

          <ListItem button component={Link} to="/integration" >
            <ListItemIcon>
             <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Integration" />
          </ListItem>

          <ListItem button >
            <ListItemIcon>
             <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Konto" />
          </ListItem>
        
      </List>
      <Divider />
      <List>
      <ListItem button component={Link} to="/installningar" >
            <ListItemIcon>
            <SettingsIcon/>
            </ListItemIcon>
            <ListItemText primary="Inställningar" />
          </ListItem>

      
      </List>
    </div>
  );
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
    component="nav"
    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    aria-label="mailbox folders"
  >
    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
    <Drawer
      docked={false}
      variant="persistent"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      {drawer}
    </Drawer>
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
      open
    >
      {drawer}
    </Drawer>
  </Box>
  );
}

export default Sidebar;
