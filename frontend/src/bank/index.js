import { Link } from 'react-router-dom';
import './index.css'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import {Paper, TableRow, TableHead, Table, TableBody, Grid, Button, Breadcrumbs, Typography} from '@mui/material';

function BookKeep() {

return (
    <>
<div className="main-window">
<div className="content-container">
<h2>Bank</h2>
<div className="bank-account-container">
  <Button variant="contained" sx={{float: 'right', marginBottom: '10px'}}>Koppla till bank</Button>
  <Button component={Link} to="/bank/hantera" variant="outlined" sx={{float: 'right', marginBottom: '10px'}}>Hantera</Button>
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
          <TableCell><Link to={`bank/konto/${1930}`} className="bank-account-link">1930 - Företagskonto</Link></TableCell>
          <TableCell>SEB xxxx9321</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right">132,11 kr</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Link to={`bank/konto/${1920}`} className="bank-account-link">1920 - Plusgiro</Link></TableCell>
          <TableCell>-</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right">-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Link to={`bank/konto/${2890}`} className="bank-account-link">2890 - Anställds privata konto</Link></TableCell>
          <TableCell>-</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right">-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Link  to={`bank/konto/${1630}`} className="bank-account-link">1630 - Skattekonto</Link></TableCell>
          <TableCell>-</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right">-</TableCell>
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
