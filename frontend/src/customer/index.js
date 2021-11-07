import Sidebar from '../sidebar/index'
import './index.css'
import {useState, useEffect, forwardRef, Link} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import DescriptionIcon from '@mui/icons-material/Description';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createInvoiceData(id, invoice_number, customer, total, date, expiry_date, closed_date, access_token) {
  return { id, invoice_number, customer, total, date, expiry_date, closed_date, access_token };
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '95%',
  overflowY: 'scroll',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const styleInvoiceModal = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '800px',
  padding: '10px 10px 30px 10px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3
}


  const ITEM_HEIGHT = 48;

function createData(id, customer_number, name, org_number, attention, co_adress, adress, adress_2, zip_code, city, country, moms_number, external_id, reference, email_contact, email_invoice, phone_number, e_invoice_adress, e_invoice_provider, notes, type, active) {
    return { id, customer_number, name, org_number, attention, co_adress, adress, adress_2, zip_code, city, country, moms_number, external_id, reference, email_contact, email_invoice, phone_number, e_invoice_adress, e_invoice_provider, notes, type, active };
  }
  
  let rows = [];
  let invoiceRows = [];

function Customer() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openCustomerModal, setOpenCustomerModal] = useState(false);
    const [openEditCustomerModal, setOpenEditCustomerModal] = useState(false);
    const [customer, setCustomer] = useState([])
    const open = Boolean(anchorEl);
    const [customerType, setCustomerType] = useState('company');
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [confirmDeleteBox, setConfirmDeleteBox] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState({})
    const [updateCustomerState, setUpdateCustomerState] = useState(false);
    const [openCustomerInvoice, setOpenCustomerInvoice] = useState(false);
    const [customerInvoiceRows, setCustomerInvoiceRows] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - invoiceRows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


    const initalCustomerState = {
      country: 'Sverige',
      type: 'Company'
    }

    const [newCustomer, setNewCustomer] = useState(initalCustomerState);

    const Alert = forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    useEffect(() => { 
      fetchCustomers()
  },[updateCustomerState])

  const fetchCustomers = () => {
    fetch('http://localhost:8000/api/customer/',{
            method: 'GET',
            headers: {
              "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
              'Content-Type':'application/json',
            }
          }).then(response => response.json()).then(data => setCustomer(data)).finally(() => {
            });
    }

    useEffect(() => { 
      fetch('http://localhost:8000/api/company/',{
          method: 'GET',
          headers: {
            "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
            'Content-Type':'application/json',
          }
        }).then(response => response.json()).then(data => setNewCustomer({...newCustomer, belongs_to: data.id})).finally(() => {
          setSelectedCustomer({...selectedCustomer, belongs_to: newCustomer.company})
          });
  },[updateCustomerState])

    useEffect(() => {
        rows = []
          customer.forEach(row => {
            rows.push(createData(row.id, row.customer_number, row.name, row.org_number, row.attention, row.co_adress, row.adress, row.adress_2, row.zip_code, row.city, row.country, row.moms_number, row.external_id, row.reference, row.email_contact, row.email_invoice, row.phone_number, row.e_invoice_adress, row.e_invoice_provider, row.notes, row.type, row.active))
          });
        },[customer])

    useEffect(() => {
      invoiceRows = []
        customerInvoiceRows.forEach(row => {
          invoiceRows.push(createInvoiceData(row.id, row.invoice_number, row.customer, row.total, row.date, row.expiry_date, row.closed_date, row.access_token))
        });
      },[customerInvoiceRows])

        useEffect(() => {
            console.log(newCustomer)
          },[newCustomer])

  const saveCustomer = () => {
    setSaveLoading(true)
    const response =  fetch('http://localhost:8000/api/customer/',{
      method: 'POST',
      headers: {
          "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
          'Content-Type':'application/json',
      },
      body: JSON.stringify(newCustomer)
      }).then((response) => {
        setUpdateCustomerState(!updateCustomerState)
        if (response.status === 201) {
          setOpenSuccessAlert(true)
          setSaveLoading(false)
          setOpenCustomerModal(false)
          setNewCustomer(initalCustomerState)
        } else {
          setOpenErrorAlert(true)
          setSaveLoading(false)
        }
        console.log(newCustomer)
      }).catch((error) => {
        console.log(error)
      }).finally(function() {
        setUpdateCustomerState()
      })
    }

  const deleteCustomer = (id) => {
    fetch('http://localhost:8000/api/customer/',{
      method: 'DELETE',
      headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
      },
      body: JSON.stringify(id)
    }).then((response) => {
      setUpdateCustomerState(!updateCustomerState)
      if (response.status === 200) {
        setOpenSuccessAlert(true)
        setSaveLoading(false)
        openCustomerModal(false)
      } else {
        setOpenErrorAlert(true)
        setSaveLoading(false)
      }
      console.log(newCustomer)
    }).catch((error) => {
      console.log(error)
    }).finally(function() {
    })
    setAnchorEl(null)
    setConfirmDeleteBox(false)
    setUpdateCustomerState()
  }

  const editCustomer = (id) => {
    fetch('http://localhost:8000/api/customer/',{
      method: 'PATCH',
      headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
      },
      body: JSON.stringify(selectedCustomer)
    }).then((response) => {
      setUpdateCustomerState(!updateCustomerState)
      if (response.status === 201) {
        setOpenSuccessAlert(true)
        setSaveLoading(false)
        setOpenEditCustomerModal(false)
        setNewCustomer(initalCustomerState)
      } else {
        setOpenErrorAlert(true)
        setSaveLoading(false)
      }
      console.log(newCustomer)
    }).catch((error) => {
      console.log(error)
    }).finally(function() {
      setUpdateCustomerState()
    })
  }

  const fetchCustomerInvoices = (row) => {
    setSelectedCustomer(row)
    fetch(`http://localhost:8000/api/invoice/${row.id}/`,{
      method: 'GET',
      headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
      }
    }).then(response => response.json()).then(data => setCustomerInvoiceRows(data)).finally(() => {
      setOpenCustomerInvoice(true);
  });
}

return (
    <>
<Sidebar />

<Modal
        open={openCustomerModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2" sx={{textAlign:"center", color: 'gray'}}>
            <ContactMailIcon sx={{fontSize:80, color: "lightgray"}}/><br/>
            Ny kund
          </Typography>
          <Grid container spacing={3}>
              <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label={newCustomer.type === 'Company'? 'Organisationsnummer': 'Personnummer'}
                    defaultValue={newCustomer.org_number}
                    onChange={(e) => {setNewCustomer({...newCustomer, org_number: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>

                <Grid item xs={3}>
                <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="type"
                            name="customer-type"
                            value={newCustomer.type}
                            onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value})}
                        >
                            <FormControlLabel sx={{ height: '30px' }} value="Company" control={<Radio />} label="Företag" />
                            <FormControlLabel sx={{ height: '30px' }} value="Individual" control={<Radio />} label="Privatperson" />
                        </RadioGroup>
                        </FormControl>
                </Grid>
                <Grid item xs={6}>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Kundnummer"
                    defaultValue={newCustomer.customer_number}
                    onChange={(e) => {setNewCustomer({...newCustomer, customer_number: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label={newCustomer.type === 'Company'? 'Bolagsnamn': 'Namn'}
                    defaultValue={newCustomer.name}
                    onChange={(e) => {setNewCustomer({...newCustomer, name: e.target.value})}}
                    type="text"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Attention (inkludera Att)"
                    defaultValue={newCustomer.attention}
                    onChange={(e) => {setNewCustomer({...newCustomer, attention: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="C/O (inkludera C/O:)"
                    defaultValue={newCustomer.co_adress}
                    onChange={(e) => {setNewCustomer({...newCustomer, co_adress: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Adress"
                    defaultValue={newCustomer.adress}
                    onChange={(e) => {setNewCustomer({...newCustomer, adress: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Adress 2"
                    defaultValue={newCustomer.adress_2}
                    onChange={(e) => {setNewCustomer({...newCustomer, adress_2: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={1}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Postnr."
                    defaultValue={newCustomer.zip_code}
                    onChange={(e) => {setNewCustomer({...newCustomer, zip_code: e.target.value})}}
                    type="number"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Stad"
                    defaultValue={newCustomer.city}
                    onChange={(e) => {setNewCustomer({...newCustomer, city: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Land"
                    type="text"
                    defaultValue={newCustomer.country}
                    onChange={(e) => {setNewCustomer({...newCustomer, country: e.target.value})}}
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Moms reg. nummer"
                    defaultValue={newCustomer.moms_number}
                    onChange={(e) => {setNewCustomer({...newCustomer, moms_number: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Externt refernsid"
                    defaultValue={newCustomer.external_id}
                    onChange={(e) => {setNewCustomer({...newCustomer, external_id: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Kontaktperson"
                    defaultValue={newCustomer.reference}
                    onChange={(e) => {setNewCustomer({...newCustomer, reference: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Kontakt e-post"
                    defaultValue={newCustomer.email_contact}
                    onChange={(e) => {setNewCustomer({...newCustomer, email_contact: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Faktura e-post"
                    defaultValue={newCustomer.email_invoice}
                    onChange={(e) => {setNewCustomer({...newCustomer, email_invoice: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Telefon"
                    defaultValue={newCustomer.phone_number}
                    onChange={(e) => {setNewCustomer({...newCustomer, phone_number: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    defaultValue={newCustomer.e_invoice_adress}
                    onChange={(e) => {setNewCustomer({...newCustomer, e_invoice_adress: e.target.value})}}
                    label="GLN/PEPPOL"
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Intermediatör för e-faktura"
                    defaultValue={newCustomer.e_invoice_provider}
                    onChange={(e) => {setNewCustomer({...newCustomer, e_invoice_provider: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={6}>                    
                </Grid>
                <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={newCustomer.active} onChange={(e) => {setNewCustomer({...newCustomer, active: !(newCustomer.active)})}}/>} label="Aktiv" />
                </FormGroup>
                </Grid>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    id="outlined-multiline-flexible"
                    label="Anteckningar"
                    defaultValue={newCustomer.notes}
                    onChange={(e) => {setNewCustomer({...newCustomer, notes: e.target.value})}}
                    multiline
                    minRows={6}
                />
                </Grid>
                <Grid item xs={12}>
                <Button sx={{ float: "right", margin: "10px"}} variant="outlined" onClick={() => {setOpenCustomerModal(false)}}>
                     Avbryt
                </Button>
                <Button sx={{ float: "right", margin: "10px"}} variant="contained" onClick={() => {saveCustomer()}}>
                     Spara
                </Button>
                </Grid>
        </Grid>
        </Box>
      </Modal>


      <Modal
        open={openEditCustomerModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2" sx={{textAlign:"center", color: 'gray'}}>
            <ContactMailIcon sx={{fontSize:80, color: "lightgray"}}/><br/>
             Uppdatera kund
          </Typography>
          <Grid container spacing={3}>
              <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label={selectedCustomer.type === 'Company'? 'Organisationsnummer': 'Personnummer'}
                    defaultValue={selectedCustomer.org_number}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, org_number: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>

                <Grid item xs={3}>
                <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="type"
                            name="customer-type"
                            value={selectedCustomer.type}
                            onChange={(e) => setSelectedCustomer({...selectedCustomer, type: e.target.value})}
                        >
                            <FormControlLabel sx={{ height: '30px' }} value="Company" control={<Radio />} label="Företag" />
                            <FormControlLabel sx={{ height: '30px' }} value="Individual" control={<Radio />} label="Privatperson" />
                        </RadioGroup>
                        </FormControl>
                </Grid>
                <Grid item xs={6}>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Kundnummer"
                    defaultValue={selectedCustomer.customer_number}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, customer_number: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label={selectedCustomer.type === 'Company'? 'Bolagsnamn': 'Namn'}
                    defaultValue={selectedCustomer.name}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, name: e.target.value})}}
                    type="text"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Attention (inkludera Att)"
                    defaultValue={selectedCustomer.attention}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, attention: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="C/O (inkludera C/O:)"
                    defaultValue={selectedCustomer.co_adress}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, co_adress: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Adress"
                    defaultValue={selectedCustomer.adress}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, adress: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Adress 2"
                    defaultValue={selectedCustomer.adress_2}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, adress_2: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={1}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Postnr."
                    defaultValue={selectedCustomer.zip_code}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, zip_code: e.target.value})}}
                    type="number"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Stad"
                    defaultValue={selectedCustomer.city}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, city: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Land"
                    type="text"
                    defaultValue={selectedCustomer.country}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, country: e.target.value})}}
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Moms reg. nummer"
                    defaultValue={selectedCustomer.moms_number}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, moms_number: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Externt refernsid"
                    defaultValue={selectedCustomer.external_id}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, external_id: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Kontaktperson"
                    defaultValue={selectedCustomer.reference}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, reference: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Kontakt e-post"
                    defaultValue={selectedCustomer.email_contact}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, email_contact: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Faktura e-post"
                    defaultValue={selectedCustomer.email_invoice}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, email_invoice: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Telefon"
                    defaultValue={selectedCustomer.phone_number}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, phone_number: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    defaultValue={selectedCustomer.e_invoice_adress}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, e_invoice_adress: e.target.value})}}
                    label="GLN/PEPPOL"
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Intermediatör för e-faktura"
                    defaultValue={selectedCustomer.e_invoice_provider}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, e_invoice_provider: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={6}>                    
                </Grid>
                <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={selectedCustomer.active} onChange={(e) => {setSelectedCustomer({...selectedCustomer, active: !(selectedCustomer.active)})}}/>} label="Aktiv" />
                </FormGroup>
                </Grid>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    id="outlined-multiline-flexible"
                    label="Anteckningar"
                    defaultValue={selectedCustomer.notes}
                    onChange={(e) => {setSelectedCustomer({...selectedCustomer, notes: e.target.value})}}
                    multiline
                    minRows={6}
                />
                </Grid>
                <Grid item xs={12}>
                <Button sx={{ float: "right", margin: "10px"}} variant="outlined" onClick={() => {setOpenEditCustomerModal(false)}}>
                     Avbryt
                </Button>
                <Button sx={{ float: "right", margin: "10px"}} variant="contained" onClick={() => {editCustomer()}}>
                     Uppdatera
                </Button>
                </Grid>
        </Grid>
        </Box>
      </Modal>



      <Modal
        open={openCustomerInvoice}
        onClose={() => setOpenCustomerInvoice(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleInvoiceModal}>
          <Typography id="modal-modal-title" variant="h5" component="h4" sx={{textAlign:"center", color: 'gray'}}>
            <DescriptionIcon sx={{fontSize:60, color: "lightgray"}}/><br/>
             Skapade fakturor till {selectedCustomer.name}
          </Typography>
          <Grid container spacing={3}>
             

  <Grid item xs={12}>
      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
      <Table aria-label="custom pagination table">
        <TableHead>
          <TableRow sx={{ background: '#e5e5e5' }}>
          <TableCell align="right">#</TableCell>
          <TableCell align="right">Kund</TableCell>
          <TableCell align="right">Belopp</TableCell>
          <TableCell align="right">Fakturadatum</TableCell>
          <TableCell align="right">Förfallodatum</TableCell>
          <TableCell align="right">Stängdes</TableCell>
          <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? invoiceRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : invoiceRows
          ).map((row) => (
            <TableRow key={row.invoice_number}>
              <TableCell align="right">
                {row.invoice_number}
              </TableCell>
              <TableCell align="right">
                {row.customer.name}
              </TableCell>
              <TableCell align="right">
                {row.total}
              </TableCell>
              <TableCell align="right">
                {row.date}
              </TableCell>
              <TableCell align="right">
                {row.expiry_date}
              </TableCell>
              <TableCell align="right">
                {row.closed_date}
              </TableCell>
              <TableCell component="a" align="right">
              <a href={`http://localhost:3000/faktura/${row.id}/${row.access_token}`} target="_blank" rel="noopener noreferrer"><DescriptionIcon/></a>
             </TableCell>                 

            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {invoiceRows.length > 0 ?
          <TableRow>
            <TablePagination             
              count={invoiceRows.length}
              rowsPerPage="5"
              page={page}
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
              rowsPerPageOptions={[]}
            />
          </TableRow>
            : null}
        </TableFooter>
      </Table>
    </TableContainer>
    </Grid>

          <Grid item xs={9}></Grid>   
          <Grid item xs={3}>   
            <Button sx={{ float: "right", margin: "10px"}} variant="outlined" onClick={() => {setOpenCustomerInvoice(false); setPage(0)}}>
                      Stäng
            </Button>
          </Grid>
        </Grid>
        </Box>
      </Modal>

<div className="main-window">
<TableContainer component={Paper} sx={{ width: "80%", margin: "50px auto auto auto" }}>
    <div className="customer-table-header">
    <span>Kunder ({rows.length} st)</span>
        <Button sx={{ float: "right", margin: "10px"}} variant="contained" onClick={() => {setOpenCustomerModal(true)}}>
             <AddIcon /> Ny kund
        </Button>
    </div>
      <Table aria-label="simple table" size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Kundnr.</TableCell>
            <TableCell align="right">Namn</TableCell>
            <TableCell align="right">Org./Pers.nr</TableCell>
            <TableCell align="right">Kontaktperson</TableCell>
            <TableCell align="right">E-Post</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.customer_number}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.org_number}</TableCell>
              <TableCell align="right">{row.reference}</TableCell>
              <TableCell align="right">{row.email_invoice}</TableCell>
              
              <TableCell align="right">
                  <Tooltip title="Visa skapta fakturor">
                      <IconButton aria-label="Visa skapta fakturor" onClick={() => {fetchCustomerInvoices(row)}}>
                            <DescriptionIcon fontSize="small"/>
                      </IconButton>
                  </Tooltip>                  
                  <Tooltip title="Redigera">
                     <IconButton aria-label="Redigera">
                            <EditIcon fontSize="Small" onClick={() => {setOpenEditCustomerModal(true); setSelectedCustomer(row)}}/>
                      </IconButton>
                  </Tooltip>
                  <Tooltip title="Ta bort">
                      <IconButton aria-label="Ta bort" onClick={() => {setConfirmDeleteBox(true); setSelectedCustomer(row)}}>
                            <DeleteIcon fontSize="small"/>
                      </IconButton>
                  </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

</div>


<Dialog
        open={confirmDeleteBox}
        onClose={() => {setConfirmDeleteBox(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Ta bort kund"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Kunden <b>{selectedCustomer.name}</b> kommer att tas bort
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {deleteCustomer(selectedCustomer.id)}}>Ta Bort</Button>
          <Button onClick={() => {setConfirmDeleteBox(false)}} autoFocus>Avbryt</Button>
        </DialogActions>
      </Dialog>


        <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={openSuccessAlert} autoHideDuration={5000} onClose={() => setOpenSuccessAlert(false)}>
        <Alert severity="success">Ändring har sparats</Alert>
        </Snackbar>
        </Stack>
    
        <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={openErrorAlert} autoHideDuration={5000} onClose={() => setOpenErrorAlert(false)}>
        <Alert severity="error">Gick inte att spara</Alert>
        </Snackbar>
        </Stack>

  </>
  );
}

export default Customer;
