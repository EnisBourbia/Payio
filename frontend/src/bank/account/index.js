import { Link } from 'react-router-dom';
import '../index.css'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import {Paper, TableRow, TableHead, Table, TableBody, Grid, Menu, MenuItem, Button, Breadcrumbs, Typography, Avatar, Chip} from '@mui/material';
import { useState, useEffect } from 'react';
import image from '../../assets/images/cost.png'

function BookKeep(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

return (
    <>
<div className="main-window">
<div className="content-container">
<Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link className="breadcrumb-link" underline="hover" to="/bank">
          Bank
        </Link>
        <Typography color="text.primary">{props.match.params.account} - Kontonamn</Typography>
</Breadcrumbs>
<Button
    id="basic-button"
    variant="outlined"
    aria-controls="basic-menu"
    aria-haspopup="true"
    sx={{float: 'right', margin: 0}}
    aria-expanded={open ? 'true' : undefined}
    onClick={(e) => setAnchorEl(e.currentTarget)}
  >
    Hantera importer
  </Button>
  <Menu
    id="basic-menu"
    anchorEl={anchorEl}
    open={open}
    onClose={() => setAnchorEl(null)}
    MenuListProps={{
      'aria-labelledby': 'basic-button',
    }}
  >
    <MenuItem component={Link} to="/skapa-faktura" onClick={() => setAnchorEl(null)}>Koppla bank</MenuItem>
    <MenuItem component={Link} to="/skapa-avtalsfaktura" onClick={() => setAnchorEl(null)}>Hantera importer</MenuItem>
  </Menu>
<h2>{props.match.params.account} - Kontonamn</h2>
<div className="bank-account-container">
  <TableContainer component={Paper} sx={{ marginTop: 4 }}>
    <Table sx={{ minWidth: 650 }} size="medium" aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Datum</TableCell>
          <TableCell>Meddelande</TableCell>
          <TableCell align="right">Status</TableCell>
          <TableCell align="right">Summa</TableCell>
        </TableRow>
      </TableHead>
        <TableBody>
        <TableRow>
          <TableCell><Avatar src={image} /></TableCell>
          <TableCell>2021-11-12</TableCell>
          <TableCell>ICA AB</TableCell>
          <TableCell align="right"><Chip label="Ny import" variant="outlined" color="primary" /></TableCell>
          <TableCell align="right">132,11 kr</TableCell>
        </TableRow>      
        </TableBody>
    </Table>
    </TableContainer>
</div>
</div>
</div>
  </>
  );
}

export default BookKeep;
