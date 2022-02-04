import { Link } from 'react-router-dom';
import {Paper, useFormControl, TableRow, TableHead, InputAdornment, Toolbar, Tabs, Alert, Tab, OutlinedInput, Tooltip, Table, TableBody, Grid, TablePagination, TableSortLabel, Menu, MenuItem, Button, Checkbox, Breadcrumbs, Typography, Avatar, Chip, Box, Modal, IconButton, TextField, Select, FormHelperText, FormControl, InputLabel, Divider} from '@mui/material';
import { useState, useEffect, useMemo, useCallback } from 'react';
import NoSelected from '../../assets/images/no-transaction-selected.svg';
import PropTypes from 'prop-types';
import DatePicker from '@mui/lab/DatePicker';
import { sv } from 'date-fns/locale';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {useDropzone} from 'react-dropzone'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Viewer } from '@react-pdf-viewer/core';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
      };
      
      const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
      };
      
      const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
      };

      const thumbInnerPdf = {
        textAlign: 'center',
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden',
      };
      
      const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
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

function BookKeep(props) {
    const [tabValue, setTabValue] = useState(0);
    const [newEvent, setNewEvent] = useState({
        balance: 0
    });
    const [eventRows, setEventRows] = useState([
        {account: 2730, debet: 1990, kredit: 0},
        {account: "", debet: 0, kredit: 0},
        {account: "", debet: 0, kredit: 0}
    ])
    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
      onDrop: acceptedFiles => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      }
    })

useEffect(() => () => {
// Make sure to revoke the data uris to avoid memory leaks
files.forEach(file => URL.revokeObjectURL(file.preview));
console.log(files)
}, [files]);

const updateRow = (idx, e) => {
    let array = [...eventRows];
    let item = {...eventRows[idx]}
    let value = e.target.value;
    item[e.target.name] = value
    array[idx] = item
    setEventRows([...array])
}

const deleteRow = (idx) => {
    setEventRows(eventRows.filter((item, index) => index !== idx))
}

useEffect(() => {
    setNewEvent({...newEvent, balance: parseFloat(eventRows.reduce((a,v) => parseFloat(a) + parseFloat(v.debet), 0)) - parseFloat(eventRows.reduce((a,v) => parseFloat(a) + parseFloat(v.kredit), 0))})
    console.log(props.selected)
},[eventRows])

const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
        {file.type === "application/pdf" ? 
        <div style={thumbInnerPdf}>
        <PictureAsPdfIcon sx={{ fontSize: 38, color: 'gray', margin: 'auto auto auto 25px' }}/> 
        </div> :
         <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
        </div>
    }
    </div>
  ));

return (
    <>
      <Box style={{ backgroundColor: '#FFF', height: 700, overflowY: 'auto' }}>
        { props.selected.length === 0 ?
        <Box style={{paddingTop: 250, textAlign: 'center'}}>
        <img src={NoSelected} />
        <Typography variant="h5">Ingen transaktion vald</Typography>
        <Typography>För att bokföra en banktransaktion, välj en från listan till vänster.</Typography>
        </Box>
        :
        <Box>
        <Typography variant="h6" sx={{padding: 1, borderBottom: '1px solid lightgray', textAlign: 'center'}}>Bokför {props.selected.length > 1 ? 'valda' : 'vald'} transaktioner</Typography>
            <Tabs indicatorColor="secondary" textColor="inherit" variant="fullWidth" color="secondary" value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="basic tabs example" centered>
            <Tab label="Manuell" {...a11yProps(0)} />
            <Tab label="Alla mallar" {...a11yProps(1)} disabled />
            <Tab label="Förslag" {...a11yProps(2)} disabled/>
            </Tabs>
            <Divider/>

            <TabPanel value={tabValue} index={2}>
                Item One
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={tabValue} index={0}>
            {props.selected.length > 1 ? <Alert severity="info">Du kan inte bokföra mer än en transaktion åt gången om du bokför manuellt.</Alert> : 
            <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                    fullWidth
                    label="Titel"
                    id="outlined-size-small"
                    defaultValue={props.rows[props.selected].message}
                    size="small"
                    />
                </Grid>
                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={sv}>                
                        <DatePicker
                            size="small"
                            disabled
                            label="Fakturadatum"
                            value={props.rows[props.selected].date}
                            onChange={(newValue) => {
                                setNewEvent({...newEvent, date: newValue})
                            }}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>


                { eventRows.map((row, idx) => {

                  return (
                      <>
                <Grid item xs={4}>
                {idx === 0 ? <Typography variant="overline">Konto</Typography> : null}
                    <TextField
                    disabled={idx === 0 ? true : false}
                    hiddenLabel
                    variant="filled"
                    value={row.account}
                    name="account"
                    onChange={(e) => updateRow(idx, e)}
                    placeholder="Nummer"
                    size="small"                                 
                    />
                </Grid>
         
                <Grid item xs={3}>
                {idx === 0 ? <Typography variant="overline">Debet</Typography> : null}
                    <TextField
                    disabled={idx === 0 ? true : false || eventRows[idx].kredit != 0}
                    hiddenLabel
                    variant="filled"
                    type="number"
                    name="debet"
                    onChange={(e) => updateRow(idx, e)}
                    value={row.debet}
                    size="small"                                 
                    />
                </Grid>
                <Grid item xs={3}>
                {idx === 0 ? <Typography variant="overline">Kredit</Typography> : null}
                    <TextField
                    disabled={idx === 0 ? true : false || eventRows[idx].debet != 0}
                    hiddenLabel
                    variant="filled"
                    type="number"
                    name="kredit"
                    onChange={(e) => updateRow(idx, e)}
                    value={row.kredit}
                    size="small"   
                    />
                </Grid>
                <Grid item xs={2}>
                {idx === 0 ? null : <IconButton onClick={() => deleteRow(idx)}><DeleteIcon/></IconButton>}
                </Grid>
                      </>
                  )
                })
            }
                           
                <Grid item xs={12}>
                    <Button variant="outlined" onClick={() => {setEventRows([...eventRows, {account: "", debet: 0, kredit: 0}])}}><AddIcon/> Ny rad</Button>    
                </Grid>
                <Grid item xs={12}>
                    {newEvent.balance !== 0 ? <Alert severity="warning">Debet och kredit balanseras ej ({newEvent.balance} kr)</Alert>:
                    <Alert severity="success">Debet och kredit är balanserade</Alert>
                }
                <br/>
                </Grid>
                <Grid item xs={12}>
                <section sx={{marginTop:2}} className="container">
                <div {...getRootProps({className: 'bookkeep-dropdown-container'})}>
                    <input {...getInputProps()} />
                    <CloudUploadIcon sx={{ color: 'rgb(7, 170, 102)' }}/>
                    <p>Dra en fil hit, eller klicka för att bläddra på din enhet</p>
                </div>
                <aside style={thumbsContainer}>
                    {thumbs}
                </aside>
                </section>     
                </Grid>   
                <Grid item xs={12}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Kommentar"
                        fullWidth
                        multiline
                        rows={4}
                        />
                </Grid>    
                <Grid item xs={12}>
                    <Button disabled={newEvent.balance === 0 ? false : true} fullWidth variant="contained">Bokför</Button>
                </Grid>
            </Grid>
            </>
            }
            </TabPanel>
        </Box>
        }
      </Box>

  </>
  );      

}

export default BookKeep;
