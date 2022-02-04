import { Link } from 'react-router-dom';
import '../index.css'
import Bookkeep from '../../assets/components/Bookkeep';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import {Paper, TableRow, TableHead, Toolbar, Tooltip, Table, TableBody, Grid, TablePagination, TableSortLabel, Menu, MenuItem, Button, Checkbox, Breadcrumbs, Typography, Avatar, Chip, Box, Modal, IconButton, TextField, Select, FormHelperText, FormControl, InputLabel} from '@mui/material';
import { useState, useEffect } from 'react';
import seb_avatar from '../../assets/images/seb-avatar.png'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DatePicker from '@mui/lab/DatePicker';
import { sv } from 'date-fns/locale';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SyncIcon from '@mui/icons-material/Sync';
import NoSelected from '../../assets/images/no-transaction-selected.svg';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import PropTypes from 'prop-types';
import { visuallyHidden } from '@mui/utils';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

const MENU_ITEM_HEIGHT = 48;

function createTransactionRow(id, image, message, account, date, sum) {
  return {
    id,
    image,
    message,
    account,
    date,
    sum,
  };
}

const headCells = [
  {
    id: 'image',
    numeric: false,
    disablePadding: true,
    label: '',
  },
  {
    id: 'message',
    numeric: false,
    disablePadding: true,
    label: 'Meddelande',
  },
  {
    id: 'account',
    numeric: true,
    disablePadding: false,
    label: 'Konto',
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Datum',
  },
  {
    id: 'sum',
    numeric: true,
    disablePadding: false,
    label: 'Summa',
  },
];

const rows = [
  createTransactionRow('0', '', 'SKATTEVERKET', 'Företagskonto - 1930', '2021-11-22', '-2100'),
  createTransactionRow('1', '', 'SEB', 'Föredsatagskonto - 19320', '2021-10-22', '-1900'),

];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'right'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} {numSelected > 1 ? 'Valda': 'Vald'} - Bokför i rutan till höger
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Transaktioner
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
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
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


return (
    <>
<div className="main-window">
<div className="content-container">
<Box style={{ float: 'right' }}>
  <Button variant="outlined"><SyncIcon/> Synka</Button>
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
        <MenuItem component={Link} to="/bank/hantera" onClick={() => setAnchorEl(null)}>Hantera kopplade banker</MenuItem>
  </Menu>
</Box>
<h2>Transaktioner att bokföra</h2>


<Grid container spacing={3}>
    <Grid item xs={7}>
      <Box style={{ backgroundColor: '#FFF', height: 700 }}>
      <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <Avatar sx={{ bgcolor: 'white', border: '1px solid gray', '&:hover': {cursor: 'pointer', borderColor: 'black'} }}>
                        {row.image === "" ? <AddIcon color="disabled" fontSize="small" /> : <img src={row.image} /> }
                        </Avatar>
                      </TableCell>
                      <TableCell align="right">{row.message}</TableCell>
                      <TableCell align="right">{row.account}</TableCell>
                      <TableCell align="right">{row.date}</TableCell>
                      <TableCell align="right">{row.sum}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (false ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        { rows.length > 10 ?
        <TablePagination
          component="div"
          count={rows.length}
          rowsPerPage={10}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
        /> : null}
      </Box>
    </Grid>

    <Grid item xs={5}>
      <Bookkeep selected={selected} rows={rows}/>
    </Grid>
</Grid>


</div>
</div>
  </>
  );
}

export default BookKeep;
