import React,  {useCallback} from 'react';
import { Link } from 'react-router-dom';
import './index.css'
import {useState, useEffect, forwardRef} from 'react'
import companyLogo from '../assets/images/devlerLogo.png'
import { useSelector, useDispatch } from 'react-redux'
import { setCompany } from '../redux/Company';
import { toggleEditCompanyModal, toggleApplicationModal } from '../redux/Modal';
import Tab from '@mui/material/Tab';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Grid from '@mui/material/Grid';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InfoIcon from '@mui/icons-material/Info';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Modal from '@mui/material/Modal';
import LinkIcon from '@mui/icons-material/Link';
import { Api, Media_URL } from '../Api'
import {Accordion, AccordionSummary, AccordionDetails, IconButton, Menu, MenuItem, Chip, Select, FormControl, InputLabel, FormHelperText} from '@mui/material'
import DatePicker from '@mui/lab/DatePicker';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { sv } from 'date-fns/locale';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {useDropzone} from 'react-dropzone'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const MENU_ITEM_HEIGHT = 48;

const drawerWidth = 240;

const addUserModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '450px',
  height: '270px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const newCalendarModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600px',
  padding: '30px 30px 100px 30px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
};


const Input = styled('input')({
  display: 'none',
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    
    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
    }
    
    TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    };
    
    function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
    }

function createPriceRow(description, price) {
    return { description, price };
    }
function createMonthlyPriceRow(description, price) {
    return { description, price };
    }
function createInvoiceRow(id, invoice_number, date, expiry_date, invoice_link) {
      return { id, invoice_number, date, expiry_date, invoice_link };
    }
    
    var rows = [];
    var rowsMonthly = [];
    var rowsInvoices = [];


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor:  '#DFDFDF',
          borderBottom: '1px solid #CFCFCF',
          color: theme.palette.common.black,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

function Settings(props) {
const { window } = props;
const [mobileOpen, setMobileOpen] = useState(false);

const dispatch = useDispatch();
//const { company } = useSelector((state) => state)
const { modal } = useSelector((state) => state)
const [company, setCompany] = useState(null);
const [companyState, setCompanyState] = useState(false);
const [loading, setLoading] = useState(true);
const [tabValue, setTabValue] = useState(0);
const [editCompany, setEditCompany] = useState({});
const [newLogo, setNewLogo] = useState(false);
const [fortnoxModal, setFortnoxModal] = useState(false);
const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
const [openErrorAlert, setOpenErrorAlert] = useState(false);
const [invoice, setInvoice] = useState();
const [anchorEl, setAnchorEl] = useState(null);
const openMenuOptions = Boolean(anchorEl);
const [newCalendarModal, setNewCalendarModal] = useState(false)
const [addUserModal, setAddUserModal] = useState(false)
const [newUser, setNewUser] = useState({})
const [uploadedSIE, setUploadedSIE] = useState([])

const [newCalendar, setNewCalendar] = useState({
  start_date: new Date(),
  end_date: new Date(new Date().setMonth(11)).setDate(31),
  metod: 'Fakturametoden',
  moms_interval: 'Varje månad'
})

const onDrop = useCallback(acceptedFiles => {
  setUploadedSIE([...uploadedSIE, ...acceptedFiles])
}, [uploadedSIE])

const {getRootProps, getInputProps, isDragActive} = useDropzone({
  onDrop,
  maxFiles:1,
  accept: '.se'
});

const removeAllUploads = () => {
  setUploadedSIE([])
}

const files = uploadedSIE.map(file => (
  <>
  <TableCell>
    <b>{file.path}</b>
  </TableCell>
  <TableCell>
    <b>{parseInt(file.size * 8 / 8000)} KB</b>
  </TableCell>
    <TableCell align="right">
      <IconButton onClick={() => removeAllUploads()}>
      <DeleteIcon/>
    </IconButton>
  </TableCell>
  </>
));

useEffect(() => { 
    Api.get('invoice/companies/')
    .then(response => {
        setCompany(response.data)
        setLoading(false);
        rows = [
            createPriceRow("Fakturaavgift (debet)", response.data.arrangement.invoice_price),
            createPriceRow("Leveransavgift (E-faktura)", response.data.arrangement.delivery_price_Einvoice),
            createPriceRow("Leveransavgift (E-mail)", response.data.arrangement.delivery_price_email),
            createPriceRow("Leveransavgift (SMS)", response.data.arrangement.delivery_price_sms),
            ];
        rowsMonthly = [
            createMonthlyPriceRow("Fortnoxintegration", response.data.arrangement.fortnox_integration)
            ];
    });
},[companyState, uploadedSIE])


useEffect(() => { 
  Api.get('invoice/invoices/fakturio/')
  .then(response => {
  rowsInvoices = []
      response.data.forEach(row => {
      let invoice_link = `/faktura/${row.id}/${row.access_token}/`
      rowsInvoices.push(createInvoiceRow(row.id, row.invoice_number, row.date, row.expiry_date, invoice_link))
      });      
  });
},[])

const submitCompany = () => {
    Api.patch('invoice/companies/',
        editCompany)
        .then((response) => {
            if (response.status == 200) {
              setOpenSuccessAlert(true)
            } else {
              setOpenErrorAlert(true)
            }
          }).catch((error) => {
            console.error("error", error)
            setOpenErrorAlert(true)
          })
      }

useEffect(() => {
  if(newLogo !== false) {
  let formData = new FormData();
  formData.append('logo', newLogo);
    Api.patch('invoice/companies/',
        formData)
        .then((response) => {
            if (response.status == 200) {
              setOpenSuccessAlert(true)
              setCompanyState(!companyState)
            } else {
              setOpenErrorAlert(true)
            }
          }).catch((error) => {
            setOpenErrorAlert(true)
            console.error("error", error)
          })
      }
      },[newLogo])

    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }


    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });

    if (company == undefined ) {
        return <p>Data is loading...</p>;
      }

return (
    <>
<div className="main-window">
<div className="content-container">

<h2>Inställningar för {company.name} - {company.org_number}</h2>
    <div className="settings-container">
      <h4>Bolag</h4>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
        <Typography variant="subheading1" gutterBottom component="p"><b>Ändra bolagsuppgifter och logotyp</b></Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Box>
            <Grid container id="grid-container" spacing={3}>
              <Grid item lg={6} xs={12}>
                <h6>Bolagsuppgifter</h6>
                <hr/>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      onChange={(e) => {setEditCompany({...editCompany, attention: e.target.value})}}
                      defaultValue={company.attention}
                      id="outlined-password-input"
                      label="Attention (inkludera Att:)"
                      type="text"
                      autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={6}>
                    <TextField
                      fullWidth
                      defaultValue={company.co_adress}
                      onChange={(e) => {setEditCompany({...editCompany, co_adress: e.target.value})}}
                      id="outlined-password-input"
                      label="C/O (inkludera C/O:)"
                      type="text"
                      autoComplete="off"
                      />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      defaultValue={company.adress}
                      onChange={(e) => setEditCompany({...editCompany, adress: e.target.value})}
                      id="outlined-password-input"
                      label="Adress"
                      type="text"
                      autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                      fullWidth
                      defaultValue={company.adress_2}
                      onChange={(e) => setEditCompany({...editCompany, adress_2: e.target.value})}
                      id="outlined-password-input"
                      label="Adress 2"
                      type="text"
                      autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                      fullWidth
                      defaultValue={company.zip_code}
                      onChange={(e) => setEditCompany({...editCompany, zip_code: e.target.value})}
                      id="outlined-password-input"
                      label="Postnr."
                      type="number"
                      autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                      fullWidth
                      defaultValue={company.city}
                      onChange={(e) => setEditCompany({...editCompany, city: e.target.value})}
                      id="outlined-password-input"
                      label="Stad"
                      type="text"
                      autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                      fullWidth
                      defaultValue={company.country}
                      disabled={true}
                      value="Sverige"
                      label="Land"
                      type="text"
                      autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                      fullWidth
                      defaultValue={company.phone_number}
                      onChange={(e) => setEditCompany({...editCompany, phone_number: e.target.value})}
                      id="outlined-password-input"
                      label="Bolagstelefon"
                      type="text"
                      autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                      fullWidth
                      defaultValue={company.moms_number}
                      onChange={(e) => setEditCompany({...editCompany, moms_number: e.target.value})}
                      id="outlined-password-input"
                      label="Moms reg-nr"
                      type="text"
                      autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                      fullWidth
                      defaultValue={company.residence}
                      onChange={(e) => setEditCompany({...editCompany, residence: e.target.value})}
                      label="Bolagets säte"
                      type="text"
                      autoComplete="off"
                      />
                    </Grid>
            </Grid>
            </Grid>
                  <Grid item lg={6} xs={12}>
                   <h6>Kontaktuppgifter</h6>
                    <hr/>
                   <Grid container spacing={2}>
                     <Grid item xs={12}>
                    <TextField
                      fullWidth
                      defaultValue={company.reference}
                      onChange={(e) => setEditCompany({...editCompany, reference: e.target.value})}
                      id="outlined-password-input"
                      label="Kundkontakt på era fakturor"
                      type="text"
                      autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                      fullWidth
                      defaultValue={company.email_contact}
                      onChange={(e) => setEditCompany({...editCompany, email_contact: e.target.value})}
                      id="outlined-password-input"
                      label="E-post"
                      type="text"
                      autoComplete="off"
                      />
                  </Grid>
                    <Grid item xs={12}>
                    <TextField
                      fullWidth
                      onChange={null}
                      defaultValue={company.responsible}
                      id="outlined-password-input"
                      label="Firmatecknare"
                      type="text"
                      autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={12}>
                    <Tooltip title="E-post som används för fakturering av tjänster använda i Fakturio">
                    <TextField
                      fullWidth
                      defaultValue={company.email_invoice}
                      onChange={(e) => setEditCompany({...editCompany, email_invoice: e.target.value})}
                      id="outlined-password-input"
                      label="Fakturaepostadress"
                      type="text"
                      autoComplete="off"
                      />
                      </Tooltip>
                    </Grid>
            </Grid>
            </Grid>
            <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox defaultChecked={company.f_skatt} onChange={(e) => setEditCompany({...editCompany, f_skatt: e.target.checked})} />} label="Godkänd för F-skatt" />
                    <Button id="save-settings-button" variant="contained" onClick={submitCompany}>
                      Spara <SaveIcon sx={{ paddingLeft: '5px' }}/>
                    </Button>
            </Grid>
            <Grid item xs={12}>
                    <span>Bolagslogga <Tooltip title="Ladda upp logga som ska synas i faktura"><InfoIcon sx={{ fontSize: '17px', color: '#0B96DA' }}/></Tooltip></span><br/>
                    {company.logo === null ? null: <> <img className="company-logo-settings" src={`${Media_URL.meidaURL}${company.logo}`}/><br/><br/> </>}
                    <label htmlFor="contained-button-file">
                    <Input accept="image/*" id="contained-button-file" onChange={(e) => {setNewLogo(e.target.files[0])}} type="file" />      
                    <Button variant="contained" component="span">
                      Välj logga
                    </Button>
                    <Button id="logo-buttons" variant="outlined" onClick={(e) => {setNewLogo('delete')}}>
                      Ta bort logga <DeleteIcon/>
                    </Button>
                     </label>
                    </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
        <Typography variant="subheading1" gutterBottom component="p"><b>Prislista för tjänster</b></Typography>
        </AccordionSummary>
        <AccordionDetails>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                <TableHead>
                <TableRow>
                    <StyledTableCell>Beskrivning</StyledTableCell>
                    <StyledTableCell align="">Pris</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableRow>
                    <TableCell sx={{ background: '#DFDFDF' }}>Transaktionsavgifter</TableCell>
                    <TableCell sx={{ background: '#DFDFDF' }}></TableCell>
                </TableRow>
                <TableBody>
                {rows.map((row) => (
                    <StyledTableRow
                    key={row.description}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <StyledTableCell align="">{row.description}</StyledTableCell>
                    <StyledTableCell align="">{row.price} SEK</StyledTableCell>
                    </StyledTableRow>
                ))}
                    <TableRow>
                        <TableCell sx={{ background: '#DFDFDF' }}>Månadsavgifter</TableCell>
                        <TableCell sx={{ background: '#DFDFDF' }}></TableCell>
                    </TableRow>
                {rowsMonthly.map((row) => (
                    <StyledTableRow
                    key={row.description}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <StyledTableCell align="">{row.description}</StyledTableCell>
                    <StyledTableCell align="">{row.price} SEK</StyledTableCell>
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
    </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
        <Typography variant="subheading1" gutterBottom component="p"><b>Fakturor att betala</b></Typography>
        </AccordionSummary>
        <AccordionDetails>
        <h6>Fakturor ({rowsInvoices.length})</h6>
          <hr/>
          {rowsInvoices.length === 0 ? <span>Du har inga fakturor från Fakturio.</span> :
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                <TableHead>
                <TableRow>
                    <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell align="">Datum</StyledTableCell>
                    <StyledTableCell align="">Förfallodatum</StyledTableCell>
                    <StyledTableCell align=""><DescriptionIcon/></StyledTableCell>

                </TableRow>
                </TableHead>
              
                <TableBody>
                {rowsInvoices.map((row) => (
                    <StyledTableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <StyledTableCell align="">{row.id}</StyledTableCell>
                    <StyledTableCell align="">{row.date}</StyledTableCell>
                    <StyledTableCell align="">{row.expiry_date}</StyledTableCell>
                    <StyledTableCell align=""><a href={row.invoice_link} target="_blank"><DescriptionIcon/></a></StyledTableCell>
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
    </TableContainer>
            }
        </AccordionDetails>
      </Accordion>

      <Accordion>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
        <Typography variant="subheading1" gutterBottom component="p"><b>Hanteranvändare</b></Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Button variant="outlined" sx={{marginBottom: 1, float: 'right'}} onClick={() => setAddUserModal(true)}>Bjud in ny användare</Button>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                <TableHead>
                <TableRow>
                    <StyledTableCell>Namn</StyledTableCell>
                    <StyledTableCell align="">E-post</StyledTableCell>
                    <StyledTableCell align=""></StyledTableCell>

                </TableRow>
                </TableHead>
              <TableCell>Enis Bourbia</TableCell>
              <TableCell>Enis@devler.se</TableCell>
              <TableCell align="right">
                <IconButton aria-label="Ta bort">
                    <DeleteIcon fontSize="Small"/>
                </IconButton>
              </TableCell>
                <TableBody>
                </TableBody>
            </Table>
    </TableContainer>
        </AccordionDetails>
      </Accordion>
</div>


<div className="settings-container">
      <h4>Bokföring</h4>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
        <Typography variant="subheading1" gutterBottom component="p"><b>Visa baskontoplan</b></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            Vi använder oss av baskontoplan 2020
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
        <Typography variant="subheading1" gutterBottom component="p"><b>Importera bokföring</b></Typography>
        </AccordionSummary>
        <AccordionDetails>
        <section className="container">
        <div {...getRootProps({className: 'sie-dropdown-container'})}>
        <input {...getInputProps()} />
        <CloudUploadIcon/>
        {!isDragActive && (<p>Dra en fil hit, eller klicka för att bläddra på din enhet</p>)}
        {isDragActive && (<p>Släpp filen...</p>)}

      </div>
      <aside>
        <h5>Uppladdad fil</h5>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Filnamn</TableCell>
                  <TableCell>Filstorlek</TableCell>
                </TableRow>
              </TableHead>
                <TableBody>
                    <StyledTableRow>
                      {files}
                    </StyledTableRow>
                </TableBody>
            </Table>
         </TableContainer>
            <Button disabled={uploadedSIE.length > 0 ? false: true } sx={{ 'float': 'right', margin: '20px 0px 20px 0px' }} variant="contained">Kontrollera fil</Button>
      </aside>
    </section>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
        <Typography variant="subheading1" gutterBottom component="p"><b>Exportera bokföring</b></Typography>
        </AccordionSummary>
        <AccordionDetails>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
              
                <TableBody>
                    <StyledTableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell align=""><b>01 Jan 2021 - 31 Dec 2021</b></TableCell>
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
                      {['SIE4'].map((option) => (
                        <MenuItem key={option} selected={option === 'Pyxis'} onClick={() => openMenuOptions = false}>
                          {option}
                        </MenuItem>
                      ))}
                    </Menu>
                    </TableCell>
                    </StyledTableRow>
                </TableBody>
            </Table>
    </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
        <Typography variant="subheading1" gutterBottom component="p"><b>Hantera räkneskapsår</b></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button variant="outlined" sx={{marginBottom: 1, float: 'right'}} onClick={() => setNewCalendarModal(true)}>Skapa nytt</Button>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
              <TableHead>
                <StyledTableCell>Period</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableHead>
                <TableBody>
                    <StyledTableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell align=""><b>01 Jan 2021 - 31 Dec 2021</b></TableCell>
                    <TableCell align=""><Chip variant="filled" label="Öppet" color="primary"/></TableCell>
                    </StyledTableRow>
                    <StyledTableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell align=""><b>01 Jan 2021 - 31 Dec 2021</b></TableCell>
                    <TableCell align=""><Chip variant="outlined" label="Stängd" color="warning"/></TableCell>
                    </StyledTableRow>
                </TableBody>
            </Table>
    </TableContainer>
        </AccordionDetails>
      </Accordion>
</div>

</div>
</div>

      <Modal
        open={addUserModal}
        onClose={() => setAddUserModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={addUserModalStyle}>
          <Typography id="modal-modal-title" variant="h4" component="h2" sx={{textAlign:"center", color: 'gray'}}>
             Lägg till användare
          </Typography>
          <Grid container>

          <Grid item xs={12}>
            <br/>
            <TextField   
              fullWidth        
              id="outlined-password-input"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              label="E-post"                    
              type="text"
              autoComplete="off"
              />
            </Grid>
          <Grid item xs={12}>
            <Button sx={{ position:'absolute', bottom: '20px', float: "left", margin: "10px"}} variant="outlined" onClick={() => setAddUserModal(false)}>
                  Avbryt
            </Button>
            <Button sx={{ position:'absolute', bottom: '20px', right: '20px', float: "right", margin: "10px"}} variant="contained" onClick={() => setAddUserModal(false)}>
                  Spara
            </Button>
          </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={newCalendarModal}
        onClose={() => setNewCalendarModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={newCalendarModalStyle}>
          <Typography id="modal-modal-title" variant="h4" component="h2" sx={{textAlign:"center", color: 'gray'}}>
             Skapa nytt räkenskapsår
          </Typography>

          <Grid container spacing={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={sv}>
            <Grid item xs={6}>
              <br/>
                    <DatePicker
                        label="Fakturadatum"
                        value={newCalendar.start_date}
                        onChange={(newValue) => {
                            setNewCalendar({...newCalendar, start_date: newValue})
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
            </Grid>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={sv}>
            <Grid item xs={6}>
              <br/>
                    <DatePicker
                        label="Fakturadatum"
                        value={newCalendar.end_date}
                        onChange={(newValue) => {
                            setNewCalendar({...newCalendar, end_date: newValue})
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
            </Grid>
            </LocalizationProvider>
            <Grid item xs={12}>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Hur ofta redovisar företaget moms?</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={newCalendar.moms_interval}
                onChange={(e) => setNewCalendar({...newCalendar, moms_interval: e.target.value})}
                label="Hur ofta redovisar företaget moms?"
              >
              <MenuItem value={'Varje månad'}>Varje månad</MenuItem>
              <MenuItem value={'Var tredje månad'}>Var tredje månad</MenuItem>
              <MenuItem value={'Varje år'}>Varje år</MenuItem>
              </Select>
              <FormHelperText>Du kan kolla vilken period du har på verksamt.se</FormHelperText>
            </FormControl>
            </Grid>
            <Grid item xs={12}>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Vilken redovisningsmetod har företaget?</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={newCalendar.metod}
                onChange={(e) => setNewCalendar({...newCalendar, metod: e.target.value})}
                label="Vilken redovisningsmetod har företaget?"
              >
              <MenuItem value={'Fakturametoden'}>Fakturametoden</MenuItem>
              <MenuItem value={'Kontantmetoden'}>Kontantmetoden</MenuItem>
              </Select>
              <FormHelperText>Kontantmetoden kallas ibland bokslutsmetoden. DU kan kolla vilken metod du har på verksamt.se</FormHelperText>
            </FormControl>
            </Grid>

          <Grid item xs={12}>
            <Button sx={{ position:'absolute', bottom: '20px', float: "left", margin: "10px"}} variant="outlined" onClick={() => setNewCalendarModal(false)}>
                  Avbryt
            </Button>
            <Button sx={{ position:'absolute', bottom: '20px', right: '20px', float: "right", margin: "10px"}} variant="contained" onClick={() => setNewCalendarModal(false)}>
                  Spara
            </Button>
          </Grid>
          </Grid>
        </Box>
      </Modal>
      

    <Stack spacing={3} sx={{ width: '100%' }}>
        <Snackbar open={openSuccessAlert} autoHideDuration={5000} onClose={() => setOpenSuccessAlert(false)}>
        <Alert severity="success">Ändring har sparats</Alert>
        </Snackbar>
    </Stack>
    
    <Stack spacing={3} sx={{ width: '100%' }}>
        <Snackbar open={openErrorAlert} autoHideDuration={5000} onClose={() => setOpenErrorAlert(false)}>
        <Alert severity="error">Gick inte att spara</Alert>
        </Snackbar>
    </Stack>
  </>
  );
}

export default Settings;
