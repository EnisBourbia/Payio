import Sidebar from '../sidebar/index'
import './index.css'
import {useState, useEffect, forwardRef} from 'react'
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BusinessIcon from '@mui/icons-material/Business';
import GavelIcon from '@mui/icons-material/Gavel';
import Switch from '@mui/material/Switch';
import Select, { selectClasses } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
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
    const response =  fetch('http://localhost:8000/api/product/',{
      method: 'POST',
      headers: {
          "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
          'Content-Type':'application/json',
      },
      body: JSON.stringify(newProduct)
      }).then((response) => {
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
      }).finally(function() {
        setUpdateProductState()
      })
    }

  const deleteProduct = (id) => {
    fetch('http://localhost:8000/api/product/',{
      method: 'DELETE',
      headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
      },
      body: JSON.stringify(id)
    }).then((response) => {
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
    fetch('http://localhost:8000/api/product/',{
      method: 'PATCH',
      headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
      },
      body: JSON.stringify(selectedProduct)
    }).then((response) => {
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
    }).finally(function() {
      setUpdateProductState()
    })
  }

    useEffect(() => { 
      fetch('http://localhost:8000/api/company/',{
          method: 'GET',
          headers: {
            "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
            'Content-Type':'application/json',
          }
        }).then(response => response.json()).then(data => setNewProduct({...newProduct, company: data.id})).finally(() => {
          setSelectedProduct({...selectedProduct, company: newProduct.company})
          });
  },[updateProductState])

  const fetchProducts = () => {
      fetch('http://localhost:8000/api/product/',{
          method: 'GET',
          headers: {
            "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
            'Content-Type':'application/json',
          }
        }).then(response => response.json()).then(data => setProduct(data)).finally(() => {
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
  <Sidebar />
  
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
  <TableContainer component={Paper} sx={{ width: "80%", margin: "50px auto auto auto" }}>
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
