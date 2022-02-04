import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png'
import './index.css'
import { useState, useRef, useEffect } from 'react';
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
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { companySlice } from '../redux/Company';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Badge from '@mui/material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import { Api } from '../Api'
import { Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../redux/User';
import { setTodo } from '../redux/Todo';


const Input = styled('input')({
  display: 'none',
});

const drawerWidth = 240;

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openBank, setOpenBank] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user)
  const { todo } = useSelector((state) => state.todo)

  useEffect(() => { 
    Api.get('bookkeep/todo/')
    .then(response => {
      dispatch(setTodo(response.data))
          });
  },[])

  useEffect(() => { 
    Api.get('user/user/')
    .then(response => {
      dispatch(setUser(response.data))
    })
  },[])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawer = (
    <div>
      <Toolbar />
      <label id="upload-button-sidebar" htmlFor="contained-button-file-logo">
        <Input accept="image/* pdf" id="contained-button-file-logo" type="file" />
        <Button sx={{ width: 160, display: 'inline-block', margin: 'auto auto 10px auto', textAlign: 'center' }} variant="contained" component="span">
          Ladda upp
        </Button>
      </label>
    <Divider/>
      <List>
        <ListItem onClick={() => {setOpenBank(false); setOpenInvoice(false)}} button component={Link} to="/" >
              <ListItemIcon>
              <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Översikt" />
        </ListItem>


          <ListItem onClick={() => {setOpenBank(false); setOpenInvoice(false)}} button component={Link} to="/att-gora" >
            <ListItemIcon>
            <Badge badgeContent={todo.todo_count} color="primary">
              <EventAvailableIcon />
            </Badge>
            </ListItemIcon>
            <ListItemText primary="Saker att göra" />
          </ListItem>

          <ListItem onClick={() => {setOpenBank(false); setOpenInvoice(false)}} button component={Link} to="/oversikt" >
            <ListItemIcon>
             <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary="Rapporter" />
          </ListItem>

        <Divider/>
          <ListItem onClick={() => {setOpenBank(true); setOpenInvoice(false)}} button component={Link} to="/bank" >
            <ListItemIcon>
             <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Bank" />
            {openBank ? <ExpandLess /> : <ExpandMore />}
          </ListItem>


          
          <Collapse in={openBank} timeout="auto" unmountOnExit sx={{borderLeft: '5px solid #2b67ff'}}>
        <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }} component={Link} to="/bank" >
            <ListItemIcon>
             <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Bank" />
          </ListItemButton>

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/bank/transaktioner">
            <ListItemIcon>
              <PaymentsIcon />
            </ListItemIcon>
            <ListItemText primary="Transaktioner" />
          </ListItemButton>

        </List>
        </Collapse>

        <ListItem onClick={() => {setOpenBank(false); setOpenInvoice(false)}} button component={Link} to="/bokforing" >
            <ListItemIcon>
             <GavelIcon />
            </ListItemIcon>
            <ListItemText primary="Bokföring" />
          </ListItem>

      <ListItemButton onClick={() => {setOpenBank(false); setOpenInvoice(true)}} component={Link} to="/fakturering">
        <ListItemIcon>
        <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary="Fakturering" />
        {openInvoice ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openInvoice} timeout="auto" unmountOnExit sx={{borderLeft: '5px solid #2b67ff'}}>
        <List component="div" disablePadding>

        <ListItemButton sx={{ pl: 4 }} onClick={() => {setOpenBank(false); setOpenInvoice(true)}} component={Link} to="/fakturering">
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Översikt" />
          </ListItemButton>

        <ListItemButton sx={{ pl: 4 }} onClick={() => {setOpenRegister(!openRegister)}}>
        <ListItemIcon>
        <PlaylistAddIcon />
        </ListItemIcon>
        <ListItemText primary="Register" />
        {openRegister ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

        </List>
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

      </Collapse>     

        
      </List>
      <Divider />
      <List>
      <ListItem onClick={() => {setOpenBank(false); setOpenInvoice(false)}} button component={Link} to="/installningar" >
            <ListItemIcon>
            <SettingsIcon/>
            </ListItemIcon>
            <ListItemText primary="Inställningar" />
          </ListItem>

      </List>

      <div className="user-info-sidebar">
        <Typography color="gray" variant="">INLOGGAD SOM: {user.first_name} {user.last_name}</Typography><br/>
        <Typography color="gray">NUVARANDE PLAN</Typography>
        <Chip label="Bokföring & Fakturering" color="primary"/>
      </div>

    </div>
  );
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
    <div className="header-bar">
      <div className="header-content">
        <span>Devler AB <ArrowDropDownIcon /></span>
        <span> 2020-2021 <ArrowDropDownIcon /></span>
      </div>
    </div>
    <div className="header-bar-spacer"></div>
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
  </>
  );
}

export default Sidebar;
