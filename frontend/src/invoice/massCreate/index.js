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
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';


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

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }
  
  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }
  
  function union(a, b) {
    return [...a, ...not(b, a)];
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
const [selectedCustomer, setSelectedCustomer] = useState([]);

const initialInvoiceState = {
    company: company.id,
    customers: null,
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
const [displayInvoiceOptions, setDisplayInvoiceOptions] = useState(true)
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
const [checked, setChecked] = React.useState([]);
const [left, setLeft] = useState([]);
const [right, setRight] = useState([]);

const leftChecked = intersection(checked, left);
const rightChecked = intersection(checked, right);

const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

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
        // setSelectedCustomer({...selectedCustomer, belongs_to: data})
        setCurrentInvoice({...currentInvoice, company: data.id})
        });
},[updateProductState, updateCustomerState])

useEffect(() => { 
    setSelectedCustomer(right)
    setCurrentInvoice({...currentInvoice, customers: right})
},[right])

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
  }, [open]);
    
useEffect(() => { fetch('http://localhost:8000/api/customer/',{
    method: 'GET',
    headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
        }
    }).then(response => response.json()).then(data =>  {
        dispatch(setCustomer(data))
        setLeft(data)
    })
},[dispatch, updateCustomerState])

useEffect(() => { fetch('http://localhost:8000/api/company/',{
    method: 'GET',
    headers: {
        "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
        'Content-Type':'application/json',
    }
}).then(response => response.json()).then(data => setCompany(data))
},[])

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
      setLoadingSubmitLoading(true)
      const response =  fetch('http://localhost:8000/api/invoice/mass',{
        method: 'POST',
        headers: {
            "Authorization":  "Bearer " + localStorage.getItem('accessToken'),
            'Content-Type':'application/json',
        },
        body: JSON.stringify([currentInvoice, rows])
        }).then((response) => {
            if (response.status == 201) {
                //window.location.href = "/faktura"
                setInvoiceSuccess(true)
                setLoadingSubmitLoading(false)
                setOpenSuccessAlert(true)
                setCurrentInvoice(initialInvoiceState)
                setSelectedCustomer([])
                setLeft(customer)
                setRight([])
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

const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
      />
      <Divider />
      <List
        sx={{
          width: '100%',
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.name} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

return (
    <>
        <Sidebar />

      <div className="main-window">
        <h2>Massfaktura</h2>
      
    <div className="invoice-creation-container">
        
        <div className="client-info">
        <div className="client-container">
        <h5>Kunder</h5>
        <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={6}>
        <Grid container spacing={0} justifyContent="center" alignItems="center">
      <Grid item xs={5}>{customList('Kunder', left)}</Grid>
      <Grid item xs={2}>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={5}>{customList(`${right.length} mottagare`, right)}</Grid>
    </Grid>
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
            </Grid>
            </TabPanel>
        </Box>
        </Grid>
        </Grid>
        </div>
        </div>

        <div className="product-container">
        <h5>Produkter/tjänster</h5>
        <Grid container>
            <Grid item>
            <Autocomplete
                id="select-product"
                sx={{ width: 300 }}
                onChange={(event, value) => {addRow(value)}}                
                value={productAutocomplete}
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
                    defaultValue="Påminnelse"
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
        </> : null}
        </div>
        <Button id="publish-invoice" variant="contained" onClick={submitInvoice}>Publicera</Button>
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loadingSubmitLoading}
            >
            <CircularProgress color="inherit" />
        </Backdrop>

    </div>
    </div>

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
