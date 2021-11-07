import { Link } from 'react-router-dom';
import React from 'react';
import Topbar from '../../topbar/index'
import Sidebar from '../../sidebar/index'
import './index.css'
import Chart from "react-apexcharts";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setInvoice } from '../../redux/Invoice';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import DescriptionIcon from '@mui/icons-material/Description';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Company from '../../redux/Company';

var selectedRows = []
var selectedRowsAttested = []


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function createData(id, access_token, invoice_number, customer, company, total, date, expiry_date, status, delivery, invoice_type, invoice_link) {
  return {
    id,
    access_token,
    invoice_number,
    customer,
    company,
    total,
    date,
    expiry_date,
    status,
    delivery,
    invoice_type,
    invoice_link
  };
}


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'invoice_number',
    numeric: false,
    disablePadding: true,
    label: 'Fakturanr',
  },
  {
    id: 'customer',
    numeric: true,
    disablePadding: false,
    label: 'Kund',
  },
  {
    id: 'total',
    numeric: true,
    disablePadding: false,
    label: 'Belopp(inkl moms)',
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Datum',
  },
  {
    id: 'expiry_date',
    numeric: true,
    disablePadding: false,
    label: 'Förfallodatum',
  },

  {
    id: 'delivery',
    numeric: true,
    disablePadding: false,
    label: 'Fakturaleverans',
  },
  {
    id: 'type',
    numeric: true,
    disablePadding: false,
    label: 'Fakturatyp',
  },
];

const headCellsAttested = [
  {
    id: 'invoice_number',
    numeric: false,
    disablePadding: true,
    label: 'Fakturanr',
  },
  {
    id: 'customer',
    numeric: true,
    disablePadding: false,
    label: 'Kund',
  },
  {
    id: 'total',
    numeric: true,
    disablePadding: false,
    label: 'Belopp(inkl moms)',
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Datum',
  },
  {
    id: 'expiry_date',
    numeric: true,
    disablePadding: false,
    label: 'Förfallodatum',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'delivery',
    numeric: true,
    disablePadding: false,
    label: 'Fakturaleverans',
  },
  {
    id: 'type',
    numeric: true,
    disablePadding: false,
    label: 'Fakturatyp',
  },
  {
    id: 'invoice_view',
    numeric: true,
    disablePadding: false,
    label: <DescriptionIcon/>,
  },
  {
    id: 'invoice_pdf',
    numeric: true,
    disablePadding: false,
    label: <PictureAsPdfIcon />,
  }
];
var rows = []

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort  } =
  props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <>
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
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
    </>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  handleAlert: PropTypes.func.isRequired

};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <>
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
          {numSelected} Valda
        </Typography>
      ) : null}

      {numSelected > 0 ? null : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
        <Typography
          sx={{ margin: '20px', fontWeight: 600 }}
          variant=""
          id=""
          component="span"
        >
          Ej attesterade ({rows.length}) st
        </Typography>
        </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  openSuccessAlert: PropTypes.bool.isRequired
};

var selectedRows = []
var rowsAttested = []

function EnhancedTableHeadAttested(props) {
  const { order, orderBy, onRequestSort  } =
  props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <>
    <TableHead>
      <TableRow>
        {headCellsAttested.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
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
    </>
  );
}

EnhancedTableHeadAttested.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  handleAlert: PropTypes.func.isRequired
};

const EnhancedTableAttestedToolbar = (props) => {

  return (
    <>
        <Typography
          sx={{ padding: '30px 10px 10px 20px', fontWeight: 600 }}
          variant=""
          id=""
          component="div"
        >
          Attesterade ({rowsAttested.length}) st
        </Typography>
        </>
  );
};

EnhancedTableAttestedToolbar.propTypes = {
  openSuccessAlert: PropTypes.bool.isRequired
};

function Home() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('invoices');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [pageAttest, setPageAttest] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const dispatch = useDispatch();
  //const [invoice, setInvoice] = useState([])
  const { invoice } = useSelector((state) => state.invoice)
  const [filterInvoice, setFilterInvoice] = useState();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [updateInvoiceState, setUpdateInvoiceState] = useState(false);
  const [attestedInvoices, setAttestedInvoices] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmAttest, setConfirmAttest] = useState(false);


  useEffect(() => { 
    fetchInvoices()
    console.log(invoice)
},[updateInvoiceState])

const fetchInvoices = () => {
  fetch('http://localhost:8000/api/invoice/?status=Created',{
    method: 'GET',
    headers: {
      "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
      'Content-Type':'application/json',
    }
  }).then(response => response.json()).then(data => dispatch(setInvoice(data))).finally(() => {
    setLoading(false);
    setUpdateInvoiceState()
    });
  fetch('http://localhost:8000/api/invoice/?status=Attested',{
    method: 'GET',
    headers: {
      "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
      'Content-Type':'application/json',
    }
  }).then(response => response.json()).then(data => setAttestedInvoices(data)).finally(() => {
    setLoading(false);
    console.log(attestedInvoices)
    setUpdateInvoiceState()
    });
}

useEffect(() => {
  rows = []
    invoice.forEach(row => {
      let invoice_link = `/faktura/${row.id}/${row.access_token}/`
      rows.push(createData(row.id, row.access_token, row.invoice_number, row.customer.name, row.company.name, row.total, row.date, row.expiry_date, row.status, row.delivery, row.invoice_type, invoice_link))
    });
    setButtonLoading(false)
    setSelected([])
  },[invoice])

  useEffect(() => {
    rowsAttested = []
      attestedInvoices.forEach(row => {
        let invoice_link = `/faktura/${row.id}/${row.access_token}/`
        rowsAttested.push(createData(row.id, row.access_token, row.invoice_number, row.customer.name, row.company.name, row.total, row.date, row.expiry_date, row.status, row.delivery, row.invoice_type, invoice_link))
      });
    },[attestedInvoices])

  function updateInvoice(status, value) {
    setButtonLoading(true)
    const response =  fetch('http://localhost:8000/api/invoice/',{
      method: 'PATCH',
      headers: {
          "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
          'Content-Type':'application/json',
      },
      body: JSON.stringify([status, value])
      }).then((response) => {
        if (response.status === 200) {
          setUpdateInvoiceState(!updateInvoiceState)
          setOpenSuccessAlert(true)
        } else {
          setOpenErrorAlert(true)
          setButtonLoading(false)
        }
      }).catch((error) => {
        console.log(error)
      }).finally(function() {
        console.log(selectedRows)
      })
      setUpdateInvoiceState()
      }

function deleteInvoice(value) {
  setButtonLoading(true)
  console.log(selectedRows)
  const response =  fetch('http://localhost:8000/api/invoice/',{
    method: 'DELETE',
    headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
    },
    body: JSON.stringify(value)
    }).then((response) => {
      if (response.status === 200) {
        setUpdateInvoiceState(!updateInvoiceState)
        setOpenSuccessAlert(true)
      } else {
        setUpdateInvoiceState(!updateInvoiceState)
        setOpenErrorAlert(true)
      }
    }).catch((error) => {
      console.log(error)
    }).finally(function() {
      console.log(selectedRows)
    })
    }
      const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = invoice.map((n) => n.id);
      setSelected(newSelecteds);
      selectedRows = newSelecteds
      return;

    }
    setSelected([]);
  };

  const handleClick = (event, invoice) => {
    const selectedIndex = selected.indexOf(invoice);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, invoice);
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
    selectedRows = newSelected
   // handleNewRowSelect()
    console.log(newSelected)
  };

  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePageAttest = (event, newPage) => {
    setPageAttest(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


function status(invoice_status) {
  switch (invoice_status) {
    case 'Created':
      return 'Oattesterad'
    case 'Attested':
      return 'Attesterad'
      case 'Sent':
        return 'Skickat'        
        case 'Completed':
          return 'Betalt'           
      default: 
      return null      
  }
}

function statusCode(invoice_status) {
  switch (invoice_status) {
    case 'Created':
      return '0'
    case 'Attested':
      return '1'        
    case 'Sent':
      return '2'
    case 'Payed':
      return '3'              
    default: 
      return null      
  }
}

  function type(invoice_type) {
    switch (invoice_type) {
      case 'Simple':
        return '----'
      case 'Deal':
        return 'Avtalsfaktura'        
      case 'Group':
        return 'Massfaktura'       
      default: 
        return null               
    }
}

      function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
         
      if (loading) {
        return <p>Data is loading...</p>;
      }

  const downloadPdf = (id, token, company) => {
        const response = fetch(`http://localhost:8000/api/invoice/pdf/${id}/${token}/`, {
          method: 'GET',
      })
      .then(response => response.blob())
      .then(blob => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = `${company}-${id}`;
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();    
          a.remove();  //afterwards we remove the element again         
      });
      }
      
return (
    <>
        <Sidebar />

      <div className="main-window">
        <h2>Faktura överiskt</h2>
      {/* <div className="money-data-container">
        <span className="border-right-green">
          <h6>Fakturerad summa</h6>
          <h4>{numberWithSpaces((invoice.reduce((a,v) => Math.floor(a) + Math.floor(v.total), 0)))} kr</h4>
        </span>

        <span>
          <h6>Summa inbetalningar</h6>
          <h4>{numberWithSpaces(invoice.filter(({status}) => status === 2).reduce((a,v) => Math.floor(a) +  Math.floor(v.total), 0))} kr</h4>
        </span>
      </div> */}

    <div className="invoice-table">
        <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length}/>
          {selected.length > 0 ? 
          <>
          <ButtonGroup disableElevation variant="contained" sx={{ float:'right', margin: "10px"}}>
          <LoadingButton
          onClick={() => {setConfirmDelete(true)}}
          endIcon={<DeleteIcon />}
          loading={buttonLoading}
          loadingPosition="end"
          variant="contained"
          size="small"
          >Ta bort
          </LoadingButton>
  
  
          <LoadingButton
          onClick={() => setConfirmAttest(true)}
          endIcon={<CheckBoxIcon />}
          loading={buttonLoading}
          loadingPosition="end"
          variant="contained"
          size="small"
          >Attestera
          </LoadingButton>
          </ButtonGroup>
  
          </>
          :null}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              />

            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
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
                        #
                      </TableCell>
                      <TableCell align="right">{row.customer}</TableCell>
                      <TableCell align="right">{numberWithSpaces(row.total)}</TableCell>
                      <TableCell align="right">{row.date}</TableCell>
                      <TableCell align="right">{row.expiry_date}</TableCell>
                      <TableCell align="right">{row.delivery}</TableCell>
                      <TableCell align="right">{type(row.invoice_type)}</TableCell>
                      <TableCell align="right"><IconButton component={Link} to={`/faktura/redigera/${row.id}/${row.access_token}`}><EditIcon/></IconButton></TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage={"Antal rader"}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </Paper>
    </Box>
    </div>

    <div className="invoice-table">
        <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableAttestedToolbar numSelected={selected.length}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            >
            <EnhancedTableHeadAttested
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rowsAttested.length}
              />

            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rowsAttested, getComparator(order, orderBy))
                .slice(pageAttest * rowsPerPage, pageAttest * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.invoice_number}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.invoice_number}
                      </TableCell>
                      <TableCell align="right">{row.customer}</TableCell>
                      <TableCell align="right">{numberWithSpaces(row.total)}</TableCell>
                      <TableCell align="right">{row.date}</TableCell>
                      <TableCell align="right">{row.expiry_date}</TableCell>
                      <TableCell align="right"><span className={`invoice-status invoice-status-${statusCode(row.status)}`}>{status(row.status)}</span></TableCell>
                      <TableCell align="right">{row.delivery}</TableCell>
                      <TableCell align="right">{type(row.invoice_type)}</TableCell>
                      <TableCell align="right"><Link to={row.invoice_link} target="_blank"><DescriptionIcon /></Link></TableCell>
                      <TableCell align="right" onClick={() => downloadPdf(row.id, row.access_token, row.company)}><IconButton><PictureAsPdfIcon /></IconButton></TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          labelRowsPerPage={"Antal rader"}
          count={rowsAttested.length}
          rowsPerPage={rowsPerPage}
          page={pageAttest}
          onPageChange={handleChangePageAttest}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </Paper>
    </Box>
    </div>
      </div>

        
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Ta bort valda fakturor"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Valda fakturor kommer att raderas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {deleteInvoice(selectedRows); setConfirmDelete(false)}}>Ta bort</Button>
          <Button onClick={() => setConfirmDelete(false)} autoFocus>
            Avbryt
          </Button>
        </DialogActions>
      </Dialog>  


      <Dialog
        open={confirmAttest}
        onClose={() => setConfirmAttest(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Attestera valda fakturor"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          När du attesterar fakturor kommer fakturorna låsas för ändringar. Vill du attestera markerade fakturor?
          Fakturan schemaläggs och skickas till kund inom 60 minuter.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {updateInvoice("Attested", selectedRows); setConfirmAttest(false)}}>Attestera</Button>
          <Button onClick={() => setConfirmAttest(false)} autoFocus>
            Avbryt
          </Button>
        </DialogActions>
      </Dialog>  


      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={openSuccessAlert} autoHideDuration={5000} onClose={() => setOpenSuccessAlert(false)}>
        <Alert severity="success">Ändring har sparats</Alert>
        </Snackbar>
        </Stack>
    
        <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={openErrorAlert} autoHideDuration={5000} onClose={() => setOpenErrorAlert(false)}>
        <Alert severity="error">Ändring misslyckades</Alert>
        </Snackbar>
        </Stack>
  </>
  );
}

export default Home;
