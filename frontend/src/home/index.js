import { Link } from 'react-router-dom';
import './index.css'
import Chart from "react-apexcharts";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setInvoice } from '../redux/Invoice';
import {Grid, Button, Modal, Box, Typography, TextField, Stepper, Step, StepLabel, StepContent} from '@mui/material';
import costImage from '../assets/images/cost.png'
import ReceiptIcon from '@mui/icons-material/Receipt';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckIcon from '@mui/icons-material/Check';

import { Api } from '../Api';
import bookkeepingImage from '../assets/images/bookkeeping.png'
import invocingImage from '../assets/images/invoicing.png'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import userGuide_1 from '../assets/images/userGuide-1.png'
import userGuide_2 from '../assets/images/userGuide-2.png'
import userGuide_3 from '../assets/images/userGuide-3.png'
import userGuide_4 from '../assets/images/userGuide-4.png'


const userGuideModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '1000px',
  height: '700px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

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

const userGuideSteps = [
  {header: 'Navigera enkelt i Payio', text: <>
    <span><LibraryBooksIcon/> <b>Lön och utläggshantering</b></span><br/>
    Här bor din bokföring med samtliga räkenskapsår och verifikat. Skapa ett nytt verifikat eller avsluta året genom att göra bokslut.<br/><br/>

    <span><ReceiptIcon/><b>Lön och utläggshantering</b></span><br/>
    Fakturera dina kunder och bokför automatiskt. Håll koll på kommande inbetalningar och skicka påminnelse direkt till kund.<br/><br/>

    <span><MoveToInboxIcon/> <b>Lön och utläggshantering</b></span><br/>
    Registrera dina leverantörsfakturor och få hjälp att hålla koll på kommande utbetalningar.<br/><br/>

    <span><PaymentIcon/> <b>Lön och utläggshantering</b></span><br/>
    Lägg till dina anställda och skapa löner. Har du köpt något åt företaget med dina privata pengar? Då kan du och dina anställda ladda upp det i utläggsfunktionen. </>, img: userGuide_1},
  {header: 'Hantera alla nya händelser från Ladda upp-knappen', text:
  <>
  Med den stora gröna knappen uppe till vänster kan du direkt bokföra alla nya händelser.<br/><br/>
  Klicka på pilen på knappen för att få upp fler alternativ:<br/><br/>
  <span><CheckIcon/> <b>Bokför med eller utan kvitto</b></span><br/>
  Ladda upp kvittot eller fakturan direkt eller bokför en transaktion utan underlag. Du kan alltid lägga till detta senare.<br/><br/>

  <span><CheckIcon/> <b>Importera från banken</b></span><br/>
Importera banktransaktioner och matcha med verifikat eller uppladdade underlag.<br/><br/>

  <span><CheckIcon/> <b>Skapa en faktura</b></span><br/><br/>
  <span><CheckIcon/> <b>Skapa löner</b></span>

  </>, img: userGuide_2},
  {header: 'Ställ in dina företagsinställningar',
   text: <>
   Under Inställningar i menyn kan du gå in och justera det mesta som rör ditt företag. Se till att kontrollera respektive räkenskapsårs start- och slutdatum, bokföringsmetod och momsperiod så att de stämmer med det du registrerat hos Skatteverket.<br/><br/>
   <b>Bjud in användare</b><br/><br/>
   Har du en delägare eller redovisningskonsult som du vill dela ditt företag med? Bjud in användare så de har tillgång till en del eller hela ditt företag i Bokio under Inställningar > Användare.
   </>
   ,img: userGuide_3},
  {header: 'Fortfarande osäker på något?',
  text:<>
Överst på sidan hittar du vår hjälp-sektion. Använd den för att få svar på dina frågor.
</>
  ,img: userGuide_4},
];

function Home() {
const [addUserModal, setAddUserModal] = useState(false)
const [userGuideMdodal, setUserGuideMdodal] = useState(false)
const [guideStepTracker, setGuideStepTracker] = useState(0)
const [newUser, setNewUser] = useState({})
const [chart, setChart] = useState({      options: {
  chart: {
    height: 350,
    type: "line",
    stacked: false
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
  }
},
series: [
  {
    name: "series-1",
    data: [30, 40, 45, 50, 49, 60, 70, 91]
  }
]
})

return (
  <>
  <div className="main-window">
    <div className="content-container">
      <h2>Välkommen till Payio</h2>
        <Grid container className="home-grid-container">
          <Grid item xs={12} lg={9}>
            <h6>Vi är här för att hjälpa ditt företag att växa</h6>
            <p>Vårt mål är att göra det enkelt att driva företag. Vi vill hjälpa dig att spara tid så att du kan fokusera på det som värdeskapande i din verksamhet.<br/>
              Klicka på hjälpcenter för att få assistans!
            </p>
          </Grid>
          <Grid item xs={12} lg={3}><br/>
            <Button variant="outlined" sx={{float: 'right'}} onClick={() => setUserGuideMdodal(true)}>Visa mig runt</Button>
          </Grid>
          <Grid item xs={12}>
            <hr/>
            <h5>Börja driva ditt företag ännu bättre</h5>
          </Grid>

          <Grid item xs={12} lg={4} className="home-service-box">
            <img src={bookkeepingImage} />
            <h6>Smart bokföring</h6>
            <p>Bokför regelbundet och få stenkoll på ditt företag.</p>
            <Button fullWidth variant="contained">Bokför verifikat</Button><br/>
            <Button fullWidth variant="text" color="inherit">Mer information</Button>
          </Grid>

          <Grid item xs={12} lg={4} className="home-service-box center-service-box">
            <img src={invocingImage} />
            <h6>Optimera din försäljning</h6>
            <p>Skapa och skicka fakturor med bara några få klick.</p>
            <Button fullWidth variant="contained">Skapa faktura</Button><br/>
            <Button fullWidth variant="text" color="inherit">Mer information</Button>
          </Grid>

          <Grid item xs={12} lg={4} className="home-service-box">
            <img src={costImage} />
            <h6>Full koll på dina kostnader</h6>
            <p>Registrera dina leverantörsfakturor snabbt och enkelt.</p>
            <Button fullWidth variant="contained">Registrera leverantörsfaktura</Button><br/>
            <Button fullWidth variant="text" color="inherit">Mer information</Button>
          </Grid>

          <Grid item lg={12}><hr/></Grid>
          <Grid item xs={12} lg={9}>
            <h6>Bjud in ny användare</h6>
            <p>Bjud in en ny användareoch samarbeta i Payio. Oavsett om du bjuder in din redovisningskonsult, affärskollega, löneadministratör eller en anställd är det enkelt att samarbeta i Payio.
            </p>
          </Grid>
          <Grid item xs={12} lg={3}><br/>
            <Button variant="outlined" sx={{float: 'right'}} onClick={() => setAddUserModal(true)}>Bjud in ny användare</Button>
          </Grid>

        </Grid>

        <div className="money-data-container">
        <span className="border-right-green">
          <h6>Summa inbetalningar</h6>
          <h4>-</h4>
        </span>

        <span>
          <h6>Utestående betalningar</h6>
          <h4>-</h4>
        </span>
      </div>

      <div className="data-chart">
      <h5>Inbetalningar</h5>
      <Chart options={chart.options} series={chart.series} type="line" width="100%" height={320} />
     </div>
     </div>


     <Modal
        open={userGuideMdodal}
        onClose={() => setUserGuideMdodal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={userGuideModalStyle}>

            <Grid container>
            <Grid item xs={6} className="grid-image-container">
            <img className="user-guide-image" src={userGuideSteps[guideStepTracker].img}/>
            </Grid>
            <Grid item xs={6}>
              <Typography id="modal-modal-title" variant="h4" component="h4" sx={{textAlign:"center", color: 'gray', padding: '20px 0px 60px 0px'}}>
                {userGuideSteps[guideStepTracker].header}
              </Typography>
              {userGuideSteps[guideStepTracker].text}
             </Grid>
          <Grid item xs={12}>
            <Button sx={{ position:'absolute', bottom: '20px', float: "left", margin: "10px"}} variant="outlined" disabled={guideStepTracker <= 0 ? true:false} onClick={() => setGuideStepTracker(guideStepTracker-1)}>
                  Föregående
            </Button>
            <Button sx={{ position:'absolute', bottom: '20px', right: '20px', float: "right", margin: "10px"}} variant="contained" onClick={() => { guideStepTracker >= 3 ? setUserGuideMdodal(false):  setGuideStepTracker(guideStepTracker+1)}}>
                  {guideStepTracker >= 3 ? 'Klar!' : 'Nästa'}
            </Button>
          </Grid>
          </Grid>
        </Box>
      </Modal>


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
  </div>
  
  </>
  );
}

export default Home;
