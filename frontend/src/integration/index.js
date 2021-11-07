import { Link } from 'react-router-dom';
import Topbar from '../topbar/index'
import Sidebar from '../sidebar/index'
import Modals from '../modals/index'

import './index.css'
import Chart from "react-apexcharts";
import { useState } from 'react';
import companyLogo from '../assets/images/devlerLogo.png'

import { useSelector, useDispatch } from 'react-redux'
import { setCompany } from '../redux/Company';
import { toggleNewRowModal, toggleEditCompanyModal } from '../redux/Modal';

function Integration() {

const dispatch = useDispatch();
const { company } = useSelector((state) => state)
const { modal } = useSelector((state) => state)



return (
    <>
<Sidebar />

{modal.editCompanyModal ? 
    <Modals class="modal-box-company">
        <i onClick={() => dispatch(toggleEditCompanyModal(!(modal.editCompanyModal)))} class="fas fa-times"></i>
        <h5>Uppdatera uppgifter</h5>
        <form>
        <span>Företagsnamn</span><br/>
        <input type="text" defaultValue={company.name}/>

        <span>Org-nummer</span><br/>
        <input type="text" disabled defaultValue={company.orgNummer}/>

        <span>Momsnummer</span><br/>
        <input type="text" defaultValue={company.vatNumber}/>

        <span>Postadress</span><br/>
        <input type="text" defaultValue={company.adress}/>

        <span>Postnummer</span><br/>
        <input type="text" defaultValue={company.postal}/>

        <span>Stad</span><br/>
        <input type="text" defaultValue={company.city}/>

        <span>Vår referens</span><br/>
        <input type="text" defaultValue={company.reference}/>

        <span>E-post</span><br/>
        <input type="text" defaultValue={company.email}/>

        <span>Telefon</span><br/>
        <input type="text" defaultValue={company.phoneNumber}/>

        <div className="payment-settings">
        <p>Hur tar du emot betalningar?</p>

        <h5>För inrikesbetalningar</h5>
        <span>Metod</span><br/>
        <div className="payment-input">
        <select>
        <option>Postgiro</option>
        <option>Bankgiro</option>
        <option>Bankkonto</option>

        </select>
        <input type="text" placeholder="Nummer"/>
        </div>

        <h5>För utrikesbetalningar</h5>
        <span>Metod</span><br/>
        <div className="payment-input">
        <select>
        <option>Bankkonto</option>
        </select>
        <input type="text" placeholder="Nummer"/>
        </div>
        </div>
        <div className="modal-footer">
            <button onClick={() => dispatch(toggleEditCompanyModal(!(modal.editCompanyModal)))} className="white-action-button mr-auto">Avbryt</button>
            <button type="submit" className="blue-action-button">Spara</button>
        </div>
        </form>
    </Modals> : null}

<div className="main-window">
<h2>Integration</h2>
<div className="company-container">
<h5><i class="fas fa-university no-float"></i> Bank</h5><button className="white-action-button" onClick={() => dispatch(toggleEditCompanyModal(!(modal.editCompanyModal)))}>Redigera</button>

<div className="row">
<div className="company-logo col-3">
<img src={companyLogo}/>
</div>
<div className="company-info col-9 row">
    <div className="col-4">
        <p>Företagsnamn</p>
        <p>{company.name}</p>
    </div>
    <div className="col-4">
    <p>Bank</p>
    <p>{company.bank}</p>
    </div>
    <div className="col-4 ">
    <p>Bankkonto</p>
    <p>{company.accountNumber}</p>
    </div>
    </div>
</div>
<div className="row">
<div className="col-3 offset-3">
        <p>Org-nummer</p>
        <p>{company.orgNummer}</p>
    </div>
    <div className="col-3">
        <p>VAT-nummer</p>
        <p>{company.vatNumber}</p>
    </div>
</div>
</div>
</div>

  </>
  );
}

export default Integration;
