import './index.css'
import {useState, useEffect, forwardRef, Link} from 'react'
import {Paper, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, PaperTextField, Autocomplete, CircularProgress, Button, Tooltip, InputLabel, Select, MenuItem, FormControl, Tabs, Tab, Typography, Box, FormGroup, FormControlLabel, Switch, Stack, Snackbar, Modal, Checkbox, RadioGroup, Backdrop, Radio, IconButton, Grid} from '@mui/material';
import './index.css'
import MuiAlert from '@mui/material/Alert';
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleNewRowModal, toggleEditCompanyModal, toggleClientModal } from '../redux/Modal';
import { setCustomer } from '../redux/Customer';
import { setCompany } from '../redux/Company';
import PropTypes from 'prop-types';
import ComputerIcon from '@mui/icons-material/Computer';
import SmsIcon from '@mui/icons-material/Sms';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { sv } from 'date-fns/locale';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import { current } from '@reduxjs/toolkit';
import BusinessIcon from '@mui/icons-material/Business';
import GavelIcon from '@mui/icons-material/Gavel';
import LoadingButton from '@mui/lab/LoadingButton';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { Api } from '../Api'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DescriptionIcon from '@mui/icons-material/Description';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';


const style = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '1200px',
  padding: '30px 0px 100px 0px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const ITEM_HEIGHT = 48;

function createData(id, product_number, description, price, unit, moms, income_account, outgoing_moms, sales_account, sales_account_eu, sales_account_eu_moms_free, type, active) {
    return { id, product_number, description, price, unit, moms, income_account, outgoing_moms, sales_account, sales_account_eu, sales_account_eu_moms_free, type, active};
  }
  
let rows = [];

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

function Products() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openEditProductModal, setOpenEditProductModal] = useState(false);
  const [product, setProduct] = useState([])
  const open = Boolean(anchorEl);
  const [modalTab, setModalTab] = useState(0);
  const [bookKeepingSettings, setBookKeepingSettings] = useState(true);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState({})
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [updateProductState, setUpdateProductState] = useState(false);
  const [confirmDeleteBox, setConfirmDeleteBox] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({})


  useEffect(() => { 
    fetchProducts()
},[updateProductState])

  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const initalProductState = {
    company: company.id,
    unit: 'st',
    moms: 25,
    type: '',
    active: true,
    income_account: 3001,
    sales_account: 3000,
    sales_account_eu: 3003,
    sales_account_eu_moms_free: 3002,
  }
  const [newProduct, setNewProduct] = useState(initalProductState);


  const handleTabChange = (event, newValue) => {
    setModalTab(newValue);
    setBookKeepingSettings(true)
  };

  const saveProduct = () => {
    setSaveLoading(true)
    Api.post('invoice/products/',
    newProduct)
    .then((response) => {
        setUpdateProductState(!updateProductState)
        if (response.status === 201) {
          setOpenSuccessAlert(true)
          setSaveLoading(false)
          setOpenProductModal(false)
          setNewProduct(initalProductState)
        } else {
          setOpenErrorAlert(true)
          setSaveLoading(false)
        }
        console.log(newProduct)
      }).catch((error) => {
        console.log(error)
        setOpenErrorAlert(true)
        setSaveLoading(false)
      }).finally(function() {
        setUpdateProductState()
      })
    }

  const deleteProduct = (id) => {
    Api.delete(`invoice/products/${id}/`)
    .then((response) => {
      setUpdateProductState(!updateProductState)
      if (response.status === 200) {
        setOpenSuccessAlert(true)
        setSaveLoading(false)
        setOpenProductModal(false)
      } else {
        setOpenErrorAlert(true)
        setSaveLoading(false)
      }
      console.log(newProduct)
    }).catch((error) => {
      console.log(error)
    }).finally(function() {
    })
    setAnchorEl(null)
    setConfirmDeleteBox(false)
    setUpdateProductState()
  }

  const editProduct = (id) => {
    Api.patch('invoice/products/',
    selectedProduct)
    .then((response) => {
      setUpdateProductState(!updateProductState)
      if (response.status === 201) {
        setOpenSuccessAlert(true)
        setSaveLoading(false)
        setOpenEditProductModal(false)
        setNewProduct(initalProductState)
      } else {
        setOpenErrorAlert(true)
        setSaveLoading(false)
      }
      console.log(newProduct)
    }).catch((error) => {
      console.log(error)
      setOpenErrorAlert(true)
      setSaveLoading(false)
    }).finally(function() {
      setUpdateProductState()
    })
  }

    useEffect(() => { 
      Api.get('invoice/companies/')
          .then(response => {
          setSelectedProduct({...selectedProduct, company: newProduct.company})
          setNewProduct({...newProduct, company: response.data.id})
          });
  },[updateProductState])

  const fetchProducts = () => {
    Api.get('invoice/products/')
    .then(response => {
          setProduct(response.data)    
          setLoading(false)
          });
      setUpdateProductState()
}

  useEffect(() => {
      rows = []
        product.forEach(row => {
          rows.push(createData(row.id, row.product_number, row.description, row.price, row.unit, row.moms, row.income_account, row.outgoing_moms, row.sales_account, row.sales_account_eu, row.sales_account_eu_moms_free, row.type, row.active))
        });
        console.log(product)
      },[product])

  if (loading) {
    <p>Loading...</p>
  }
  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
      
return (
  <>
  <Modal
          open={openProductModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <Tabs value={modalTab} onChange={handleTabChange} aria-label="basic tabs example" sx={{outline: 'none'}}>
          <Tab label="Allmänt" icon={<BusinessIcon />} {...a11yProps(0)} />
          <Tab label="Bokföring" icon={<GavelIcon />} {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={modalTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={2}>
                  <TextField   
                    fullWidth        
                    id="outlined-password-input"
                    label="Art.nr"
                    defaultValue={newProduct.product_number}
                    onChange={(e) => {setNewProduct({...newProduct, product_number: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={10}>
                  <TextField   
                    fullWidth       
                    id="outlined-password-input"
                    label="Beskrivning"
                    defaultValue={newProduct.description}
                    onChange={(e) => {setNewProduct({...newProduct, description: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={3}>
                  <TextField   
                    fullWidth       
                    id="outlined-password-input"
                    label="Enhet"
                    defaultValue={newProduct.unit}
                    onChange={(e) => {setNewProduct({...newProduct, unit: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={3}>
                  <TextField   
                    fullWidth       
                    id="outlined-password-input"
                    label="Á-pris"
                    defaultValue={newProduct.price}
                    onChange={(e) => {setNewProduct({...newProduct, price: e.target.value})}}
                    type="number"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={3}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Produkttyp</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Produkttyp"
                value={newProduct.type}
                onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
                >
                <MenuItem value='Tjänst'>Tjänst</MenuItem>
                <MenuItem value='Vara'>Vara</MenuItem>
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={3}>
                  <TextField   
                    fullWidth       
                    id="outlined-password-input"
                    label="Moms (%)"
                    defaultValue={newProduct.moms}
                    onChange={(e) => {setNewProduct({...newProduct, moms: e.target.value})}}
                    type="number"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={3}>
                  <TextField   
                    fullWidth                                  
                    id="outlined-password-input"
                    label="Externt Referens Id"
                    defaultValue={newProduct.external_id}
                    onChange={(e) => {setNewProduct({...newProduct, external_id: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={9}>
          </Grid>
          <Grid item xs={2}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={newProduct.active} onChange={(e) => {setNewProduct({...newProduct, active: !(newProduct.active)})}}/>} label="Aktiv" />
                </FormGroup>
          </Grid>
          <Grid item xs={10}>
          </Grid>
          <Grid item xs={12}>
              <Button sx={{ float: "right", margin: "10px"}} variant="outlined" onClick={() => {setOpenProductModal(false); setModalTab(0)}}>
                  Avbryt
              </Button>
              <LoadingButton sx={{ float: "right", margin: "10px"}} variant="contained" loading={saveLoading} onClick={() => saveProduct()}>
                  Spara
              </LoadingButton>
          </Grid>
        </Grid>
         </TabPanel>

        <TabPanel value={modalTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={5}>
              <FormGroup>
                <FormControlLabel control={<Switch checked={bookKeepingSettings} onChange={() => setBookKeepingSettings(!bookKeepingSettings)} />} label="Använd standard bokföringsinställningar" />
              </FormGroup>
            </Grid>
            <Grid item xs={7}>
            </Grid>
    {/* income_account: 3001,
    sales_account: 3000,
    sales_account_eu: 3003,
    sales_account_eu_moms_free: 3002, */}
            <Grid item xs={4}>
                <TextField   
                  fullWidth  
                  disabled={bookKeepingSettings}                                            
                  id="outlined-password-input"
                  label="Intäktskonto"
                  defaultValue={newProduct.income_account}
                  onChange={(e) => {setNewProduct({...newProduct, income_account: e.target.value})}}
                  type="number"
                  autoComplete="off"
                  />
            </Grid>

            <Grid item xs={4}>
                <TextField    
                  fullWidth 
                  disabled={bookKeepingSettings}             
                  id="outlined-password-input"
                  label="Utgående moms (Lämna tomt för standard)"
                  defaultValue={newProduct.outgoing_moms_account}
                  onChange={(e) => {setNewProduct({...newProduct, outgoing_moms_account: e.target.value})}}
                  type="number"
                  autoComplete="off"
                  />
            </Grid>

            <Grid item xs={4}></Grid>

            <Grid item xs={4}>
                <TextField    
                  fullWidth 
                  disabled={bookKeepingSettings}             
                  id="outlined-password-input"
                  label="Försäljning icke-EU"
                  defaultValue={newProduct.sales_account}
                  onChange={(e) => {setNewProduct({...newProduct, sales_account: e.target.value})}}
                  type="number"
                  autoComplete="off"
                  />
            </Grid>

            <Grid item xs={4}>
                <TextField    
                  fullWidth 
                  disabled={bookKeepingSettings}             
                  id="outlined-password-input"
                  label="Försäljning EU, momspliktig"
                  defaultValue={newProduct.sales_account_eu}
                  onChange={(e) => {setNewProduct({...newProduct, sales_account_eu: e.target.value})}}
                  type="number"
                  autoComplete="off"
                  />
            </Grid>

            <Grid item xs={4}>
                <TextField    
                  fullWidth 
                  disabled={bookKeepingSettings}             
                  id="outlined-password-input"
                  label="Försäljning EU, momsfri"
                  defaultValue={newProduct.sales_account_eu_moms_free}
                  onChange={(e) => {setNewProduct({...newProduct, sales_account_eu_moms_free: e.target.value})}}
                  type="number"
                  autoComplete="off"
                  />
            </Grid>
            <Grid item xs={12}>
                <Button sx={{ float: "right", margin: "10px"}} variant="outlined" onClick={() => {setOpenProductModal(false); setModalTab(0);}}>
                    Avbryt
                </Button>
                <LoadingButton sx={{ float: "right", margin: "10px"}} variant="contained" loading={saveLoading} onClick={() => saveProduct()}>
                  Spara
              </LoadingButton>
            </Grid>
        </Grid>  
        </TabPanel>

          </Box>
        </Modal>

        <Modal
          open={openEditProductModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <Tabs value={modalTab} onChange={handleTabChange} aria-label="basic tabs example" sx={{outline: 'none'}}>
          <Tab label="Allmänt" icon={<BusinessIcon />} {...a11yProps(0)} />
          <Tab label="Bokföring" icon={<GavelIcon />} {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={modalTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={2}>
                  <TextField   
                    fullWidth        
                    id="outlined-password-input"
                    label="Art.nr"
                    defaultValue={selectedProduct.product_number}
                    onChange={(e) => {setSelectedProduct({...selectedProduct, product_number: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={10}>
                  <TextField   
                    fullWidth       
                    id="outlined-password-input"
                    label="Beskrivning"
                    defaultValue={selectedProduct.description}
                    onChange={(e) => {setSelectedProduct({...selectedProduct, description: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={3}>
                  <TextField   
                    fullWidth       
                    id="outlined-password-input"
                    label="Enhet"
                    defaultValue={selectedProduct.unit}
                    onChange={(e) => {setSelectedProduct({...selectedProduct, unit: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={3}>
                  <TextField   
                    fullWidth       
                    id="outlined-password-input"
                    label="Á-pris"
                    defaultValue={selectedProduct.price}
                    onChange={(e) => {setSelectedProduct({...selectedProduct, price: e.target.value})}}
                    type="number"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={3}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Produkttyp</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Produkttyp"
                value={selectedProduct.type}
                onChange={(e) => setSelectedProduct({...selectedProduct, type: e.target.value})}
                >
                <MenuItem value='Tjänst'>Tjänst</MenuItem>
                <MenuItem value='Vara'>Vara</MenuItem>
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={3}>
                  <TextField   
                    fullWidth       
                    id="outlined-password-input"
                    label="Moms (%)"
                    defaultValue={selectedProduct.moms}
                    onChange={(e) => {setSelectedProduct({...selectedProduct, moms: e.target.value})}}
                    type="number"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={3}>
                  <TextField   
                    fullWidth                                  
                    id="outlined-password-input"
                    label="Externt Referens Id"
                    defaultValue={selectedProduct.external_id}
                    onChange={(e) => {setSelectedProduct({...selectedProduct, external_id: e.target.value})}}
                    type="text"
                    autoComplete="off"
                    />
            </Grid>
            <Grid item xs={9}>
          </Grid>
          <Grid item xs={2}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={selectedProduct.active} onChange={(e) => {setSelectedProduct({...selectedProduct, active: !(selectedProduct.active)})}}/>} label="Aktiv" />
                </FormGroup>
          </Grid>
          <Grid item xs={10}>
          </Grid>
          <Grid item xs={12}>
              <Button sx={{ float: "right", margin: "10px"}} variant="outlined" onClick={() => {setOpenEditProductModal(false); setModalTab(0)}}>
                  Avbryt
              </Button>
              <LoadingButton sx={{ float: "right", margin: "10px"}} variant="contained" loading={saveLoading} onClick={() => editProduct()}>
                Uppdatera
              </LoadingButton>
          </Grid>
        </Grid>
         </TabPanel>

        <TabPanel value={modalTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={5}>
              <FormGroup>
                <FormControlLabel control={<Switch checked={bookKeepingSettings} onChange={() => setBookKeepingSettings(!bookKeepingSettings)} />} label="Använd standard bokföringsinställningar" />
              </FormGroup>
            </Grid>
            <Grid item xs={7}>
            </Grid>
    {/* income_account: 3001,
    sales_account: 3000,
    sales_account_eu: 3003,
    sales_account_eu_moms_free: 3002, */}
            <Grid item xs={4}>
                <TextField   
                  fullWidth  
                  disabled={bookKeepingSettings}                                            
                  id="outlined-password-input"
                  label="Intäktskonto"
                  defaultValue={selectedProduct.income_account}
                  onChange={(e) => {setSelectedProduct({...selectedProduct, income_account: e.target.value})}}
                  type="number"
                  autoComplete="off"
                  />
            </Grid>

            <Grid item xs={4}>
                <TextField    
                  fullWidth 
                  disabled={bookKeepingSettings}             
                  id="outlined-password-input"
                  label="Utgående moms (Lämna tomt för standard)"
                  defaultValue={selectedProduct.outgoing_moms_account}
                  onChange={(e) => {setSelectedProduct({...selectedProduct, outgoing_moms_account: e.target.value})}}
                  type="number"
                  autoComplete="off"
                  />
            </Grid>

            <Grid item xs={4}></Grid>

            <Grid item xs={4}>
                <TextField    
                  fullWidth 
                  disabled={bookKeepingSettings}             
                  id="outlined-password-input"
                  label="Försäljning icke-EU"
                  defaultValue={selectedProduct.sales_account}
                  onChange={(e) => {setSelectedProduct({...selectedProduct, sales_account: e.target.value})}}
                  type="number"
                  autoComplete="off"
                  />
            </Grid>

            <Grid item xs={4}>
                <TextField    
                  fullWidth 
                  disabled={bookKeepingSettings}             
                  id="outlined-password-input"
                  label="Försäljning EU, momspliktig"
                  defaultValue={selectedProduct.sales_account_eu}
                  onChange={(e) => {setSelectedProduct({...selectedProduct, sales_account_eu: e.target.value})}}
                  type="number"
                  autoComplete="off"
                  />
            </Grid>

            <Grid item xs={4}>
                <TextField    
                  fullWidth 
                  disabled={bookKeepingSettings}             
                  id="outlined-password-input"
                  label="Försäljning EU, momsfri"
                  defaultValue={selectedProduct.sales_account_eu_moms_free}
                  onChange={(e) => {setSelectedProduct({...selectedProduct, sales_account_eu_moms_free: e.target.value})}}
                  type="number"
                  autoComplete="off"
                  />
            </Grid>
            <Grid item xs={12}>
                <Button sx={{ float: "right", margin: "10px"}} variant="outlined" onClick={() => {setOpenEditProductModal(false); setModalTab(0)}}>
                    Avbryt
                </Button>
                <LoadingButton sx={{ float: "right", margin: "10px"}} variant="contained" loading={saveLoading} onClick={() => editProduct()}>
                Uppdatera
              </LoadingButton>
            </Grid>
        </Grid>  
        </TabPanel>

          </Box>
        </Modal>
  
  <div className="main-window">
  <div className="content-container">
    <h2>Produkter</h2>
  <TableContainer component={Paper}>
      <div className="customer-table-header">
      <span>Produkter ({rows.length} st)</span>
          <Button sx={{ float: "right", margin: "10px"}} variant="contained" onClick={() => {setOpenProductModal(true)}}>
               <AddIcon /> Ny produkt
          </Button>
      </div>
        <Table aria-label="simple table" size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Art.nr</TableCell>
              <TableCell align="right">Beskrivning</TableCell>
              <TableCell align="right">Á-pris</TableCell>
              <TableCell align="right">Enhet</TableCell>
              <TableCell align="right">Moms</TableCell>
              <TableCell align="right">Intäktskonto</TableCell>
              <TableCell align="right">Typ</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.product_number}
                </TableCell>

                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{numberWithSpaces(row.price)}</TableCell>
                <TableCell align="right">{row.unit}</TableCell>
                <TableCell align="right">{row.moms} %</TableCell>
                <TableCell align="right">{row.income_account}</TableCell>
                <TableCell align="right">{row.type}</TableCell>

                <TableCell align="right">
                  <Tooltip title="Redigera">
                     <IconButton aria-label="Redigera">
                            <EditIcon fontSize="Small" onClick={() => {setOpenEditProductModal(true); setSelectedProduct(row)}}/>
                      </IconButton>
                  </Tooltip>
                  <Tooltip title="Ta bort">
                      <IconButton aria-label="Ta bort" onClick={() => {setConfirmDeleteBox(true); setSelectedProduct(row)}}>
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
  </div>


      <Dialog
        open={confirmDeleteBox}
        onClose={() => {setConfirmDeleteBox(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Ta bort produkt"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Produkten <b>{selectedProduct.description}</b> kommer att tas bort
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {deleteProduct(selectedProduct.id)}}>Ta Bort</Button>
          <Button onClick={() => {setConfirmDeleteBox(false); setModalTab(0)}}>Avbryt</Button>
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

export default Products;
