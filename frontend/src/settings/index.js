import React from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../topbar/index'
import Sidebar from '../sidebar/index'
import Modals from '../modals/index'
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
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import CheckIcon from '@mui/icons-material/Check';
import Modal from '@mui/material/Modal';
import LinkIcon from '@mui/icons-material/Link';

const drawerWidth = 240;

const fortnoxModalStyle = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '1200px',
  padding: '30px 0px 100px 0px',
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

const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
};
const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

useEffect(() => { 
    fetch('http://localhost:8000/api/company/',{
    method: 'GET',
    headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
    }
}).then(response => response.json()).then(data => {
        setCompany(data)
        setLoading(false);
        rows = [
            createPriceRow("Fakturaavgift (debet)", data.arrangement.invoice_price),
            createPriceRow("Leveransavgift (E-faktura)", data.arrangement.delivery_price_Einvoice),
            createPriceRow("Leveransavgift (E-mail)", data.arrangement.delivery_price_email),
            createPriceRow("Leveransavgift (SMS)", data.arrangement.delivery_price_sms),
            ];
        rowsMonthly = [
            createMonthlyPriceRow("Fortnoxintegration", data.arrangement.fortnox_integration)
            ];
    });
},[companyState])


useEffect(() => { 
  fetch('http://localhost:8000/api/invoice/fakturio/',{
  method: 'GET',
  headers: {
      "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
      'Content-Type':'application/json',
  }
}).then(response => response.json()).then(data => {
  rowsInvoices = []
      data.forEach(row => {
      let invoice_link = `http://localhost:3000/faktura/${row.id}/${row.access_token}/`
      rowsInvoices.push(createInvoiceRow(row.id, row.invoice_number, row.date, row.expiry_date, invoice_link))
      });      
  });
},[])

const editCustomer = () => {
  console.log(editCompany)
    const response =  fetch('http://localhost:8000/api/company/',{
        method: 'PATCH',
        headers: {
            "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
            'Content-Type':'application/json'
        },
        body: JSON.stringify(editCompany)
        }).then((response) => {
            if (response.status == 200) {
              setOpenSuccessAlert(true)
            } else {
              setOpenErrorAlert(true)
            }
          })
      }

useEffect(() => {
  if(newLogo !== false) {
  let formData = new FormData();
  formData.append('logo', newLogo);
    const response =  fetch('http://localhost:8000/api/company/',{
        method: 'PATCH',
        headers: {
            "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        },
        body: formData
        }).then((response) => {
            if (response.status == 200) {
              setOpenSuccessAlert(true)
              setCompanyState(!companyState)
            } else {
              setOpenErrorAlert(true)
            }
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
    <Sidebar />
<div className="main-window">
<h2></h2>
<div className="company-container">
<h5>Inställningar för<br/> {company.name}</h5>
<span>{company.org_number}</span>


        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="inherit"
          aria-label="full width tabs example"
        >
         <Tab icon={<BusinessIcon />} label="Bolagsuppgifter" {...a11yProps(0)} />
         <Tab icon={<SettingsIcon />} label="Konfiguration" {...a11yProps(1)} />
         <Tab icon={<DescriptionIcon />} label="Fakturor från Fakturio" {...a11yProps(2)} />
         <Tab icon={<ListAltIcon />} label="Prislista" {...a11yProps(3)} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
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
                    <Button id="save-settings-button" variant="contained" onClick={editCustomer}>
                      Spara <SaveIcon sx={{ paddingLeft: '5px' }}/>
                    </Button>
            </Grid>
            <Grid item xs={12}>
                    <span>Bolagslogga <Tooltip title="Ladda upp logga som ska synas i faktura"><InfoIcon sx={{ fontSize: '17px', color: '#0B96DA' }}/></Tooltip></span><br/>
                    {company.logo === null ? null: <> <img className="company-logo-settings" src={`http://localhost:8000${company.logo}`}/><br/><br/> </>}
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
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}   alignItems="center"
>
                <Grid item lg={4}  md={6} xs={12}>
                <div className="addon-box">
                <h6>Fortnox bokföring</h6>
                <hr/>
                <span className="addon-text">Bokför automatiskt alla händelser till Fortnox genom att skapa verifikat (ej spegla kundreskontran).</span>
                <hr/>
                <Stack direction="row" spacing={1}>
                  <Chip label="Bokföring" className="bookkeeping-chip"/>
                </Stack>
                <hr/>
                <Button variant="contained" className="addon-button" onClick={() => setFortnoxModal(true)}><CheckIcon /> Aktivera (99,00 SEK/mån)</Button>
                </div>
              </Grid>
                      
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
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
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
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
        </TabPanel>
</div>
</div>


      <Modal
          open={fortnoxModal}
          onClose={() => setFortnoxModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={fortnoxModalStyle}>
          <Typography id="modal-modal-title" variant="h4" component="h2" sx={{textAlign:"center", color: 'gray'}}>
            <LinkIcon sx={{fontSize:80, color: "lightgray"}}/><br/>
            Fortnox
          </Typography>
          <div className="addon-modal-modal-input">
            <span>Ange din API-kod från Fortnox. Manual för hur du hämtar API-koden hittar du <a href="https://docs.billecta.com/Fortnox" target="_blank">här</a>.</span>
            <br/>
            <br/>
            <TextField
                id="outlined-password-input"
                label="API-kod"
                type="text"
                autoComplete="off"
                />
          </div>
          <Button sx={{ position: 'absolute',  right: 100, bottom: 5, float: "right", margin: "10px"}} variant="outlined" onClick={() => {setFortnoxModal(false)}}>
                     Avbryt
          </Button>
          <Button sx={{ position: 'absolute', right: 0, bottom: 5, float: "right", margin: "10px"}} variant="contained" onClick={() => {setFortnoxModal(false)}}>
                     Spara
          </Button>
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
