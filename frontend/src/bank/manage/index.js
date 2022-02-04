import { Link } from 'react-router-dom';
import '../index.css'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import {Paper, TableRow, TableHead, Table, TableBody, Grid, Menu, MenuItem, Button, Breadcrumbs, Typography, Avatar, Chip, Box, Modal, IconButton, TextField, Select, FormHelperText, FormControl, InputLabel} from '@mui/material';
import { useState, useEffect } from 'react';
import seb_avatar from '../../assets/images/seb-avatar.png'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DatePicker from '@mui/lab/DatePicker';
import { sv } from 'date-fns/locale';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';

const MENU_ITEM_HEIGHT = 48;

const addAccountModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600px',
  height: '300px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

function BookKeep(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [addAccountModal, setAddAccountModal] = useState(false);
  const [newAccount, setNewAccount] = useState({});
  const open = Boolean(anchorEl);
  const openMenuOptions = Boolean(anchorEl);
  const [connectedBanks, setConnectedBanks] = useState({
    start_date: new Date()
  })

return (
    <>
<div className="main-window">
<div className="content-container">
<Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link className="breadcrumb-link" underline="hover" to="/bank">
          Bank
        </Link>
        <Typography color="text.primary">Hantera företagskonton</Typography>
</Breadcrumbs>
<Button variant="outlined" sx={{float: 'right'}}> Lägg till bank</Button>
<h2>Hantera företagskonton</h2>

<div className="bank-account-container">
  <Typography variant="h6" sx={{paddingBottom: 1}}>Välj bokföringskonto för dina företagskonton</Typography>
  <p>Alla dina framtida transaktioner kommer automatiskt att kopplas till det anslutna bokförings-/betalkontot.</p>
  <div>
  <Avatar alt="Travis Howard" src={seb_avatar} sx={{display: 'inline-block', marginTop: 0}}/><span className="connected-bank-name"><b> SEB</b></span>
  <IconButton
      aria-label="more"
      id="long-button"
      aria-controls="long-menu"
      aria-expanded={openMenuOptions ? 'true' : undefined}
      aria-haspopup="true"
      sx={{float: 'right', border: '1.5px solid gray', borderRadius: 0, padding: '5px'}}
      onClick={(e) => setAnchorEl(e.currentTarget)}
    >
      <MoreVertIcon />
    </IconButton>
    <Menu
      id="long-menu"
      MenuListProps={{
        'aria-labelledby': 'long-button',
      }}
      anchorEl={anchorEl}
      open={openMenuOptions}
      onClose={() => setAnchorEl(null)}
      PaperProps={{
        style: {
          maxHeight: MENU_ITEM_HEIGHT * 4.5,
          width: '20ch',
        },
      }}
    >
      {['Redigera betalkonto', 'Radera betalkonto'].map((option) => (
        <MenuItem key={option} selected={option === 'Pyxis'} onClick={() => openMenuOptions = false}>
          {option}
        </MenuItem>
      ))}
    </Menu>
    <hr/>
    <Grid container spacing={3}>
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={sv}>
    <Grid item xs={5}>
        <DatePicker
            label="Hämta transaktioner från och med"
            disabled
            value={connectedBanks.start_date}
            onChange={(newValue) => {
                setConnectedBanks({...connectedBanks, start_date: newValue})
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
        />
        <FormControl sx={{marginTop: 2}} fullWidth>
        <InputLabel id="demo-simple-select-label">Bokförings-/betalkonto</InputLabel>
        <Select          
          labelId="demo-simple-select-label"
          disabled
          value={'1930 - Företagskonto'}
          onChange={(e) => setConnectedBanks({...connectedBanks, account: e.target.value})}
          label="Bokförings-/betalkonto"
        >
          <MenuItem value={'1930 - Företagskonto'}>1930 - Företagskonto</MenuItem>
        </Select>
        </FormControl>

    </Grid>
      </LocalizationProvider>
      <Grid item xs={2}>
      <SettingsEthernetIcon fontSize="large" sx={{display: 'block', margin: 'auto', marginTop: 5}}/>
      </Grid>
      <Grid item xs={5}>
        <div className="connected-bank-container-info">
        <Avatar alt="Travis Howard" src={seb_avatar} sx={{display: 'inline-block', marginTop: 0}}/><span className="connected-bank-name"><b> SEB</b></span><br/><br/>
          <span><b>Devler AB företagskonto</b></span><br/>
          <span>Typ: kapitalkonto</span><span className="float-right">xxxx9321</span>        
        </div>
      </Grid>
    </Grid>
      <hr/>
  </div>
  
    <Button variant="contained" sx={{marginTop: 2}}> Spara</Button>
</div>

<div className="bank-account-container">
  <Typography variant="h6" sx={{paddingBottom: 1}}>Dina betalkonton</Typography>
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} size="medium" aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Bokföringskonto</TableCell>
          <TableCell>Konto</TableCell>
          <TableCell align="right">Senaste radens datum</TableCell>
          <TableCell align="right">Nuvarande saldo</TableCell>
        </TableRow>
      </TableHead>
        <TableBody>
        <TableRow>
          <TableCell>1930 - Företagskonto</TableCell>
          <TableCell>SEB xxxx9321</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right">132,11 kr</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1920 - Plusgiro</TableCell>
          <TableCell>-</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right">-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2890 - Anställds</TableCell>
          <TableCell>-</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right">-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1630 - Skattekonto</TableCell>
          <TableCell>-</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right">
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls="long-menu"
                      aria-expanded={openMenuOptions ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      MenuListProps={{
                        'aria-labelledby': 'long-button',
                      }}
                      anchorEl={anchorEl}
                      open={openMenuOptions}
                      onClose={() => setAnchorEl(null)}
                      PaperProps={{
                        style: {
                          maxHeight: MENU_ITEM_HEIGHT * 4.5,
                          width: '20ch',
                        },
                      }}
                    >
                          <MenuItem component={Link} to="/skapa-faktura" onClick={() => setAnchorEl(null)}>Redigera betalkonto</MenuItem>
                          <MenuItem component={Link} to="/skapa-faktura" onClick={() => setAnchorEl(null)}>Radera betalkonto</MenuItem>
                    </Menu></TableCell>
        </TableRow>
        </TableBody>
    </Table>
    </TableContainer>
    <Button variant="outlined" sx={{marginTop: 2}} onClick={() => setAddAccountModal(true)}> Lägg till betalkonto</Button>
</div>
</div>
</div>

<Modal
  open={addAccountModal}
  onClose={() => setAddAccountModal(false)}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={addAccountModalStyle}>
    <Typography id="modal-modal-title" variant="h4" component="h2" sx={{textAlign:"center", color: 'gray'}}>
    Lägg till betalkonto
    </Typography>
    <Grid container spacing={3}>

    <Grid item xs={6}>
      <br/>
      <TextField   
        fullWidth        
        id="outlined-password-input"
        value={newAccount.email}
        onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
        label="Namn"                    
        type="text"
        autoComplete="off"
        />
      </Grid>
      <Grid item xs={6}>
      <br/>
      <TextField   
        fullWidth        
        id="outlined-password-input"
        value={newAccount.email}
        onChange={(e) => setNewAccount({...newAccount, number: e.target.value})}
        label="Kontonummer"                    
        type="text"
        autoComplete="off"
        />
      </Grid>
    <Grid item xs={12}>
      <Button sx={{ position:'absolute', bottom: '20px', float: "left", margin: "10px"}} variant="outlined" onClick={() => setAddAccountModal(false)}>
            Avbryt
      </Button>
      <Button sx={{ position:'absolute', bottom: '20px', right: '20px', float: "right", margin: "10px"}} variant="contained" onClick={() => setAddAccountModal(false)}>
            Spara
      </Button>
    </Grid>
    </Grid>
  </Box>
</Modal>
  </>
  );
}

export default BookKeep;
