import { Link } from 'react-router-dom';
import Topbar from '../../topbar/index'
import Sidebar from '../../sidebar/index'
import Modals from '../../modals/index'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import './index.css'
import React from 'react'
import {useState, useEffect, forwardRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleNewRowModal, toggleEditCompanyModal, toggleClientModal } from '../../redux/Modal';
import { addRow, deleteRow } from '../../redux/InvoiceRow';
import { setCustomer } from '../../redux/Customer';
import { setCompany } from '../../redux/Company';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';
import ComputerIcon from '@mui/icons-material/Computer';
import SmsIcon from '@mui/icons-material/Sms';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { sv } from 'date-fns/locale';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { current } from '@reduxjs/toolkit';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import BusinessIcon from '@mui/icons-material/Business';
import GavelIcon from '@mui/icons-material/Gavel';
import LoadingButton from '@mui/lab/LoadingButton';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { green } from '@mui/material/colors';
import Backdrop from '@mui/material/Backdrop';



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

const styleInvoice = {
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
  

function Create() {
const dispatch = useDispatch();
const { modal } = useSelector((state) => state)
//const { rows } = useSelector((state) => state.rows)
const { customer } = useSelector((state) => state.customer)
//const { company } = useSelector((state) => state)
const [products, setProducts] = useState()
const [company, setCompany] = useState({});
const [invoiceDate, setInvoiceDate] = useState(new Date());
const [invoiceExpiryDate, setInvoiceExpiryDate] = useState()
const [invoiceReminderDate, setInvoiceReminderDate] = useState();
const [productAutocomplete, setProductAutocomplete] = useState()
const [tabView, setTabView] = useState(0);
const [selectedCustomer, setSelectedCustomer] = useState({});

const initialInvoiceState = {
    company: company.id,
    customer: null,
    format: 'Email',
    currency: 'SEK',
    language: "Swedish",
    demand_start_days: 8,
    demand_payment_days: 10,
    interest: 8,
    date: new Date(),
    expiry_date: new Date(new Date().setMonth(invoiceDate.getMonth()+1)),
    reminder_date: new Date(new Date().setDate(invoiceDate.getDate()+38)),
}

const [currentInvoice, setCurrentInvoice] = useState(initialInvoiceState);
const [open, setOpen] = useState(false);
const [openProducts, setOpenProducts] = useState(false);
const [rows, setRows] = useState([]);
const [options, setOptions] = useState();
const [displayInvoiceOptions, setDisplayInvoiceOptions] = useState(false)
const [displayDemandOptions, setDisplayDemandOptions] = useState(false)
const loading = open && options.length === 0;
const [openProductModal, setOpenProductModal] = useState(false);
const [modalTab, setModalTab] = useState(0);
const [bookKeepingSettings, setBookKeepingSettings] = useState(true);
const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
const [updateProductState, setUpdateProductState] = useState(false);
const [openErrorAlert, setOpenErrorAlert] = useState(false);
const [selectedProduct, setSelectedProduct] = useState({})
const [saveLoading, setSaveLoading] = useState(false);
const [openCustomerModal, setOpenCustomerModal] = useState(false);
const [openEditCustomerModal, setOpenEditCustomerModal] = useState(false);
const [customerType, setCustomerType] = useState('company');
const [updateCustomerState, setUpdateCustomerState] = useState(false);
const [loadingSubmitLoading, setLoadingSubmitLoading] = useState(false)
const [invoiceSuccess, setInvoiceSuccess] = useState(false);


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

  const initalCustomerState = {
    country: 'Sverige',
    active: true,
    type: 'Company'
}
const [newCustomer, setNewCustomer] = useState(initalCustomerState);


const handleChange = (event, newValue) => {
    setTabView(newValue);
    console.log(currentInvoice)
};

const handleTabChange = (event, newValue) => {
    setModalTab(newValue);
};

const submitRow = (e) => {
    e.preventDefault();
    dispatch(addRow({
        id: rows.length,
        description: e.target.name.value,
        amount: e.target.amount.value,
        price: e.target.price.value,
        moms: e.target.moms.value,
        total: parseFloat((e.target.moms.value/100 +1) * e.target.price.value),
        type: e.target.type.value
    }))
    dispatch(toggleNewRowModal(!(modal.newRowModal)))    
}

const deleteProductRow = (row) => {
    setRows(rows.filter((item, index) => index !== row))
    console.log(rows)
}

useEffect(() => { 
    fetch('http://localhost:8000/api/company/',{
        method: 'GET',
        headers: {
          "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
          'Content-Type':'application/json',
        }
      }).then(response => response.json()).then(data => {
        setNewProduct({...newProduct, data})
        setNewCustomer({...newCustomer, belongs_to: data.id})
        setSelectedCustomer({...selectedCustomer, belongs_to: data})
        setCurrentInvoice({...currentInvoice, company: data.id})
        });
},[updateProductState, updateCustomerState])

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

useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        setOptions(customer);
    }
    })();
    console.log(products)

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
    console.log(currentInvoice)
  }, [open, currentInvoice]);
    
useEffect(() => { fetch('http://localhost:8000/api/customer/',{
    method: 'GET',
    headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
        }
    }).then(response => response.json()).then(data => dispatch(setCustomer(data)))
},[dispatch, updateCustomerState])

useEffect(() => { fetch('http://localhost:8000/api/company/',{
    method: 'GET',
    headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
    }
}).then(response => response.json()).then(data => setCompany(data))
},[dispatch])

useEffect(() => { fetch('http://localhost:8000/api/product/',{
    method: 'GET',
    headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
    }
}).then(response => response.json()).then(data => setProducts(data))
},[updateProductState])

useEffect(() => {
    setCurrentInvoice({...currentInvoice, netto:(rows.reduce((a,v) => a + parseFloat(v.price), 0)).toFixed(2), total:(rows.reduce((a,v) => a + parseFloat(v.price * (1 + (v.moms/100))), 0)).toFixed(2), moms:(rows.reduce((a,v) => a + parseFloat(v.price * (v.moms/100)), 0)).toFixed(2)}
    )},[rows])

const submitInvoice = () => {
    console.log([currentInvoice, rows])
    setLoadingSubmitLoading(true)
    const response =  fetch('http://localhost:8000/api/invoice/',{
        method: 'POST',
        headers: {
            "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
            'Content-Type':'application/json',
        },
        body: JSON.stringify([currentInvoice, rows])
        }).then((response) => {
            if (response.status === 201) {
                //window.location.href = "/faktura"
                setInvoiceSuccess(true)
                setLoadingSubmitLoading(false)
                setOpenSuccessAlert(true)
                setCurrentInvoice(initialInvoiceState)
                setSelectedCustomer({})
                setOptions([])
                setDisplayInvoiceOptions(false)
                setRows([])
            } else {
                setOpenErrorAlert(true)
                setLoadingSubmitLoading(false)
            }
        })
    }

    function numberWithSpaces(x) {
       return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

const addRow = (product) => {
    setRows([...rows,
        {
        product: product.id,
        product_number: product.product_number,
        description: product.description,
        amount: 1,
        unit: product.unit,
        price: product.price,
        moms: product.moms,
        total: (product.price*(1+product.moms/100)).toFixed(2),
        //total: (e.target.moms.value/100 +1) * e.target.price.value,
        type: product.type
    }])
}

const updateRow = (index, e) => {
    let array = [...rows];
    let item = {...rows[index]}
    let value = e.target.value;
    item[e.target.name] = value
    item['total'] = (item['price']*(1+item['moms']/100))*item['amount']
    array[index] = item
    setRows([...array])
}

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

return (
    <>
        <Sidebar />

      <div className="main-window">
        <h2>Registrera ny faktura</h2>
      
    <div className="invoice-creation-container">

        <div className="client-container">
        <h5>Din kund</h5>
        <div className="client-action-row row">
        <div classNameName="col-3">            
        <Autocomplete
            id="select-customer"
            sx={{ width: 300 }}
            onChange={(event, value) => {if (value === null) {
                setSelectedCustomer({})
                setDisplayInvoiceOptions(false)
                setCurrentInvoice({...currentInvoice, customer: value.id})
            }  else {
                setSelectedCustomer(value);
                setDisplayInvoiceOptions(true)}
                setCurrentInvoice({...currentInvoice, customer: value.id})
            }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            disableClearable
            renderInput={(params) => (
        <TextField
          {...params}
          id="select-customer-input"
          label="Sök efter kund"
          value={selectedCustomer.name}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
    </div>
    <Button id="new-customer" variant="contained" sx={{ margin: "10px 0px 0px 5px" }} onClick={() => setOpenCustomerModal(true)}><AddIcon/> Ny kund</Button>
    </div>
    {displayInvoiceOptions ?  

        <div className="client-info">
        <Grid container spacing={3}>
            
        <Grid item xs={12} md={12} lg={6}>
        <div className="client-info-container">
                <div className="customer-info-box">
                <Tooltip title="Redigera">
                <IconButton aria-label="Redigera">
                    <EditIcon fontSize="Small" onClick={() => {setOpenEditCustomerModal(true)}}/>
                </IconButton>
            </Tooltip><br/>
                    <span className="client-name">{selectedCustomer.name}</span><br/>
                    <span>{selectedCustomer.adress}</span><br/>
                    <span>{selectedCustomer.zip_code} {selectedCustomer.city} </span>
                </div><br/>
            <Grid container spacing={3}>    
                <Grid item xs={7}>
                <Tooltip title="">
                    <TextField
                        fullWidth
                        onChange={(e) => setCurrentInvoice({...currentInvoice, customer_reference: e.target.value})}
                        id="outlined-password-input"
                        label="Kundens referens"
                        type="text"
                        autoComplete="off"
                        />
                </Tooltip>
                </Grid>
            <Grid item xs={5}>
            <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Fakturaspråk</InputLabel>
                    <Select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(e) => setCurrentInvoice({...currentInvoice, language: e.target.value})}
                    defaultValue={currentInvoice.language}
                    label="Fakturaspråk"
                    >
                    <MenuItem value="Swedish">Svenska</MenuItem>
                    <MenuItem value="English">Engelska</MenuItem>
                    </Select>
            </FormControl>
            </Grid>
            <Grid item xs={7}></Grid>
            <Grid item xs={5}>
                <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Valuta</InputLabel>
                            <Select
                            fullWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(e) => setCurrentInvoice({...currentInvoice, currency: e.target.value})}
                            value={currentInvoice.currency}
                            label="Valuta"
                            >
                            <MenuItem value="SEK">SEK</MenuItem>
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="EURO">EURO</MenuItem>
                            </Select>
                </FormControl>
            </Grid>
            </Grid>
    </div>

    </Grid>
        <Grid item xs={12} md={12} lg={6}>
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                Skicka faktura med
                <Tabs value={tabView} onChange={handleChange} aria-label="basic tabs example">
                <Tab icon={<EmailIcon />} onClick={() => setCurrentInvoice({...currentInvoice, format: 'Email'})} label="E-post" {...a11yProps(0)} />
                <Tab disabled icon={<ComputerIcon />} onClick={() => setCurrentInvoice({...currentInvoice, format: 'E-Faktura'})} label="E-faktura" {...a11yProps(1)} />
                <Tab icon={<SmsIcon />} onClick={() => setCurrentInvoice({...currentInvoice, format: 'SMS'})} label="SMS" {...a11yProps(2)} />
                <Tab icon={<DoNotDisturbOnIcon />} onClick={() => setCurrentInvoice({...currentInvoice, format: 'Skicka inte'})} label="Skicka inte" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={tabView} index={0}>
            <Grid container spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={sv}>
            <Grid item xs={6}>
                    <DatePicker
                        label="Fakturadatum"
                        value={currentInvoice.date}
                        onChange={(newValue) => {
                            setCurrentInvoice({...currentInvoice, date: newValue})
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                </Grid>
                <Grid item xs={6}>
                    <DatePicker
                        label="Förfallodatum"
                        value={currentInvoice.expiry_date}
                        onChange={(newValue) => {
                            setCurrentInvoice({...currentInvoice, expiry_date: newValue})
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                </Grid>                
                <Grid item xs={6}>
                    <DatePicker
                        fullWidth
                        label="Påminnelsedatum"
                        value={currentInvoice.reminder_date}
                        onChange={(newValue) => {
                            setCurrentInvoice({...currentInvoice, reminder_date: newValue})
                        }}
                        renderInput={(params) => <TextField  fullWidth {...params} />}
                    />
                </Grid>
                <Grid item xs={6}></Grid>
            </LocalizationProvider>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="outlined-password-input"
                        label="Vår referens"
                        value={selectedCustomer.reference}
                        type="text"
                        autoComplete="off"
                        />
                </Grid>
            </Grid>
            </TabPanel>
            <TabPanel value={tabView} index={1}>
            <Grid container spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={sv}>
            <Grid item xs={6}>
                    <DatePicker
                        label="Fakturadatum"
                        value={currentInvoice.date}
                        onChange={(newValue) => {
                            setCurrentInvoice({...currentInvoice, date: newValue})
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                </Grid>
                <Grid item xs={6}>
                    <DatePicker
                        label="Förfallodatum"
                        value={currentInvoice.expiry_date}
                        onChange={(newValue) => {
                            setCurrentInvoice({...currentInvoice, expiry_date: newValue})
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                </Grid>                
                <Grid item xs={6}>
                    <DatePicker
                        fullWidth
                        label="Påminnelsedatum"
                        value={currentInvoice.reminder_date}
                        onChange={(newValue) => {
                            setCurrentInvoice({...currentInvoice, reminder_date: newValue})
                        }}
                        renderInput={(params) => <TextField  fullWidth {...params} />}
                    />
                </Grid>
                <Grid item xs={6}></Grid>
            </LocalizationProvider>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="outlined-password-input"
                        label="Vår referens"
                        value={selectedCustomer.reference}
                        type="text"
                        autoComplete="off"
                        />
                </Grid>
            </Grid>            
            </TabPanel>
            <TabPanel value={tabView} index={2}>
            <Grid container spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={sv}>
            <Grid item xs={6}>
                    <DatePicker
                        label="Fakturadatum"
                        value={currentInvoice.date}
                        onChange={(newValue) => {
                            setCurrentInvoice({...currentInvoice, date: newValue})
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                </Grid>
                <Grid item xs={6}>
                    <DatePicker
                        label="Förfallodatum"
                        value={currentInvoice.expiry_date}
                        onChange={(newValue) => {
                            setCurrentInvoice({...currentInvoice, expiry_date: newValue})
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                </Grid>                
                <Grid item xs={6}>
                    <DatePicker
                        fullWidth
                        label="Påminnelsedatum"
                        value={currentInvoice.reminder_date}
                        onChange={(newValue) => {
                            setCurrentInvoice({...currentInvoice, reminder_date: newValue})
                        }}
                        renderInput={(params) => <TextField  fullWidth {...params} />}
                    />
                </Grid>
            </LocalizationProvider>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="outlined-password-input"
                        label="Vår referens"
                        value={selectedCustomer.reference}
                        type="text"
                        autoComplete="off"
                        />
                </Grid>
            </Grid>
            </TabPanel>
            <TabPanel value={tabView} index={3}>
            <Grid container spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={sv}>
            <Grid item xs={6}>
                    <DatePicker
                        label="Fakturadatum"
                        value={invoiceDate}
                        onChange={(newValue) => {
                            setInvoiceExpiryDate(newValue);
                            setCurrentInvoice({...currentInvoice, date: newValue})
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                </Grid>
                <Grid item xs={6}>
                    <DatePicker
                        label="Förfallodatum"
                        value={invoiceExpiryDate}
                        onChange={(newValue) => {
                            setInvoiceExpiryDate(newValue);
                            setCurrentInvoice({...currentInvoice, expiry_date: newValue})
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                </Grid>                
                <Grid item xs={6}>
                    <DatePicker
                        fullWidth
                        label="Påminnelsedatum"
                        value={invoiceReminderDate}
                        onChange={(newValue) => {
                            setInvoiceReminderDate(newValue);
                            setCurrentInvoice({...currentInvoice, reminder_date: newValue})
                        }}
                        renderInput={(params) => <TextField  fullWidth {...params} />}
                    />
                </Grid>
                <Grid item xs={6}></Grid>
            </LocalizationProvider>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="outlined-password-input"
                        label="Vår referens"
                        value={selectedCustomer.reference}
                        type="text"
                        autoComplete="off"
                        />
                </Grid>
            </Grid>
            </TabPanel>
        </Box>
        </Grid>
        </Grid>
        </div>
        : null }
        </div>

        {displayInvoiceOptions ?  
        <>
        <div className="product-container">
        <h5>Produkter/tjänster</h5>
        <Grid container>
            <Grid item>
            <Autocomplete
                id="select-product"
                sx={{ width: 300 }}
                onChange={(event, value) => {addRow(value)}}                
                open={openProducts}
                onOpen={() => {
                    setOpenProducts(true);
                }}
                onClose={() => {
                    setOpenProducts(false);
                }}
                isOptionEqualToValue={(option, value) => option.name === value.description}
                getOptionLabel={(option) => `${option.description} (${option.product_number})`}
                options={products}
                loading={loading}
                value={null}
                disableClearable
                renderInput={(params) => (
            <TextField
            {...params}

            id="select-product-input"
            label="Lägg till produkt"
            InputProps={{
                ...params.InputProps,
                endAdornment: (
                <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                </React.Fragment>
                ),
            }}
            />
        )}
        />       
            </Grid>
            <Grid item alignItems="stretch" style={{ display: "flex" }}>
                <Button id="new-product" variant="contained" sx={{ margin: "10px 0px 0px 5px" }} onClick={() => setOpenProductModal(true)}><AddIcon/>Ny produkt</Button>
            </Grid>
        </Grid><br/>
        <table>
            <tr>
               <th>Art.nr</th>
                <th>Beskrivning</th>
                <th>Kvantitet</th>
                <th>Enhet</th>
                <th>Á-pris ({currentInvoice.currency})</th>
                <th>Moms (%)</th>
                <th>Totalt</th>
                <th></th>
            </tr>

             {rows.map((row, index) => (
                <tr key={index}>
                    <td className="table-cells product-number">{row.product_number}</td>
                    <td className="table-cells product-description"><input defaultValue={row.description} name="description" onChange={(e) => {updateRow(index, e)}}></input></td>
                    <td className="table-cells product-amount"><input defaultValue={row.amount} name="amount" onChange={(e) => {updateRow(index, e)}}></input></td>
                    <td className="table-cells product-unit"><input defaultValue={row.unit} name="unit" onChange={(e) => {updateRow(index, e)}}></input></td>
                    <td className="table-cells product-price"><input defaultValue={row.price} name="price" onChange={(e) => {updateRow(index, e)}}></input></td>
                    <td className="table-cells product-moms"><input defaultValue={row.moms} name="moms" onChange={(e) => {updateRow(index, e)}}></input></td>
                    <td className="table-cells product-total">{numberWithSpaces(row.price * row.amount)} {currentInvoice.currency}</td>
                    <td className="table-cells cell-center product-action"><IconButton><DeleteIcon onClick={() => deleteProductRow(index)}/></IconButton></td>
                </tr>
            ))}  
                <tr>
                    <td colSpan="6" className="total-info-col total-info-top">Netto</td>
                    <td colSpan="1" className="total-data-col total-info-top"><b>{numberWithSpaces((rows.reduce((a,v) => a + parseFloat((v.price*1)*v.amount), 0).toFixed(2)))} {currentInvoice.currency}</b></td>
                </tr>
                <tr>
                    <td colSpan="6" className="total-info-col">Moms</td>
                    <td colSpan="1" className="total-data-col total-info-middle"><b>{numberWithSpaces((rows.reduce((a,v) => a + parseFloat(v.price * (v.moms/100)), 0).toFixed(2)))} {currentInvoice.currency}</b></td>
                </tr>
                <tr>
                    <td colSpan="6" className="total-info-col total-info-bottom">Totalt inklusive moms</td>
                    <td colSpan="1" className="total-data-col total-info-bottom"><b>{numberWithSpaces((rows.reduce((a,v) => a + parseFloat(v.price * (1 + (v.moms/100))), 0).toFixed(2)))} {currentInvoice.currency}</b></td>
                </tr>
        </table>           

        </div>

        <div className="demand-settings">
        <div className="demand-header">
        <h5>Automatiserad kravhantering</h5>
        </div>
                    <div className="activate-demand float-right">
                    <FormGroup>
                        <FormControlLabel control={<Switch disabled checked={displayDemandOptions} onChange={() => setDisplayDemandOptions(!displayDemandOptions)} />} label="Aktivera" />
                    </FormGroup>
                    </div>

        {displayDemandOptions ? 
        <>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <label>Antal dagar efter förfallodatum som fakturan skickas till kravhantering</label><br/>
                <TextField                
                hiddenLabel
                id="outlined-password-input"
                onChange={(e) => setCurrentInvoice({...currentInvoice, demand_start_days: e.target.value})}
                variant="filled"
                value={currentInvoice.demand_start_days}
                type="number"
                autoComplete="off"
                />
            </Grid>
            <Grid item xs={12}>
            <FormControl>
                <InputLabel>Börja kravet med</InputLabel>                
                <Select
                    label="Börja kravet med"
                    onChange={(e) => setCurrentInvoice({...currentInvoice, demand_initiation: e.target.value})}
                >
                    <MenuItem value="Påminnelse">Påminnelse</MenuItem>
                    <MenuItem value="Förseningsavgift">Förseningsavgift</MenuItem>
                </Select>
            </FormControl>
            </Grid>
            <Grid item xs={12}>
                <label id="">Betalningsvillkor för krav (Dagar)</label><br/>
                <TextField                
                hiddenLabel
                id="outlined-password-input"
                onChange={(e) => setCurrentInvoice({...currentInvoice, demand_payment_days: e.target.value})}
                variant="filled"
                value={currentInvoice.demand_payment_days}
                type="number"
                autoComplete="off"
                />
            </Grid>
            <Grid item xs={12}>
                <label id="">Avtalad ränta vid utebliven betalning (%)</label><br/>
                <TextField                
                hiddenLabel
                id="outlined-password-input"
                onChange={(e) => setCurrentInvoice({...currentInvoice, interest: e.target.value})}

                variant="filled"
                value={currentInvoice.interest}
                type="number"
                autoComplete="off"
                />
            </Grid>
        </Grid>
        </>
        : null }
        </div>
        <Button id="publish-invoice" variant="contained" onClick={submitInvoice}>Publicera</Button>
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loadingSubmitLoading}
            >
            <CircularProgress color="inherit" />
        </Backdrop>
          </>
        : null }

    </div>

      </div>

      <Modal
        open={openEditCustomerModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleInvoice}>
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
        open={openCustomerModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleInvoice}>
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
                            defaultValue="company"
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

export default Create;
