import { Link } from 'react-router-dom';
import Topbar from '../../topbar/index'
import Sidebar from '../../sidebar/index'
import './index.css'
import Chart from "react-apexcharts";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setInvoice } from '../../redux/Invoice';

function InvoiceById(props) {
  const dispatch = useDispatch();
  const { invoice } = useSelector((state) => state.invoice)
  const [invoiceInfo, setInvoiceInfo] = useState(null);
  const [loading, setLoading] = useState(true);


useEffect(() => { fetch(`http://localhost:8000/api/invoice/${props.match.params.id}/${props.match.params.access_token}/`,{
  method: 'GET',
}).then(response => response.json()).then(data => setInvoiceInfo(data)).finally(() => {
setLoading(false);
});

},[])

const downloadPdf = () => {
  const response = fetch(`http://localhost:8000/api/invoice/pdf/${props.match.params.id}/${props.match.params.access_token}/`, {
    method: 'GET',
})
.then(response => response.blob())
.then(blob => {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = `${invoiceInfo[0].company.name}-${props.match.params.id}`;
    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click();    
    a.remove();  //afterwards we remove the element again         
});
}



function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

      
if (loading) {
  return <p>Data is loading...</p>;
}

return (
    <>
      
      <Topbar />
      <div className="invoice-view-container">  

      <div className="invoice-info-row">
    <h4><span className="header-icon-pdf-viewer"><i class="fas fa-hand-holding-usd"></i> </span> FAKTURA {invoiceInfo[0].invoice_number} </h4>
    <div className="invoice-info-box row">
      <div className="col-6 row">

      <div className="col-4">
        <span>ATT BETALA<br/>
          <b>{numberWithSpaces(invoiceInfo[0].total)}</b>
        </span>
        </div>

        <div className="col-4">
        <span>BANKGIRO<br/>
          <b>{invoiceInfo[0].company.bankgiro}</b>
        </span>
        </div>

        <div className="col-4">
        <span>MOTTAGARE <br/>
          <b>{invoiceInfo[0].customer.name}</b>
        </span>
        </div>

      </div>
      <div className="col-5 offset-1 row">
        <div className="col-6">
          <span>FÖRFALLODATUM<br/>
             <b>{invoiceInfo[0].expiry_date}</b>
          </span>
        </div>

        <div className="col-6">
          <span>OCR/MEDDELANDE<br/>
            <b>{invoiceInfo[0].ocr_number}</b>
          </span>
        </div>

      </div>
    </div>
  </div>

  <div className="payment-scan-row">
    <h4><span className="header-icon-pdf-viewer"><i class="fas fa-mobile-alt"></i></span> SCANNA BETALNING MED MOBILEN </h4>
    <div className="scannable-info row justify-content-center">
      <div className="col-4 ocr-scannable"><span># {invoiceInfo[0].ocr_number} #</span></div>  <div className="col-4 total-scannable"><span> {parseInt(invoiceInfo[0].total.toString().replace(".", ""), 10)}  ></span></div>      <div className="col-4 bankgiro-scannable"><span>{invoiceInfo[0].company.bankgiro} #41#</span></div>

    </div>
  </div>

  <div className="invoice-viewer-row">
  <div className="row-header"><h4><span className="header-icon-pdf-viewer"><i class="fas fa-hand-holding-usd"></i> </span> FAKTURAUPPGIFTER</h4><Link onClick={downloadPdf}><i class="fas fa-cloud-download-alt"></i> Ladda ner PDF-Faktura</Link></div>
  <div className="pdf-invoice-viewer">
  <div className="header row justify-content-center">
  <div className="company col-5">
    <img src={"http://localhost:8000" + invoiceInfo[0].company.logo} />
  </div>
  <div className="invoice-info col-4 offset-1">
    <span id="invoice-info-header">FAKTURA</span><br/>
    <span>Att betala: </span> <span className="invoice-info-data">{numberWithSpaces(invoiceInfo[0].total)} SEK</span><br/>
    <span>OCR-nr/meddelande: </span> <span className="invoice-info-data">{invoiceInfo[0].ocr_number}</span><br/>
    <span>Bankgiro: </span> <span className="invoice-info-data">{invoiceInfo[0].company.bankgiro}</span><br/>
    <span>Förfallodatum: </span> <span className="invoice-info-data">{invoiceInfo[0].expiry_date}</span>
  </div>
</div>
  

<div className="sender-row row">

  <div className="sender col-6 row">
    <div className="block-info"> 
    <span>Avsändare:</span><br/>
    <span><b>{invoiceInfo[0].company.name}</b></span><br/> 
    <span>{invoiceInfo[0].company.adress}</span><br/>
    <span>{invoiceInfo[0].company.city}</span>
    <span> {invoiceInfo[0].company.zip_code}</span><br/>
    <span>{invoiceInfo[0].company.email}</span><br/> 
  </div>
</div>

<div className="receiver col-6 row">
    <div className="block-info"> 
    <span>Mottagare:</span><br/>
    <span><b>{invoiceInfo[0].customer.name}</b></span><br/>
    <span>{ invoiceInfo[0].customer.adress }</span><br/>
    <span>{ invoiceInfo[0].customer.city }</span>
    <span> { invoiceInfo[0].customer.zip_code }</span><br/>
    </div>
  </div>
</div>


 <div className="invoice-info-2">
    <span className="invoice-info-header">Fakturanummer: </span><span className="invoice-info-text"> {invoiceInfo[0].invoice_number}</span><br/>
    <span className="invoice-info-header">Fakturadatum: </span><span className="invoice-info-text"> {invoiceInfo[0].date}</span><br/>
    <span className="invoice-info-header">Vårt org.nr:  </span><span className="invoice-info-text"> {invoiceInfo[0].company.org_number}</span><br/>
    <span className="invoice-info-header">Er referens:  </span><span className="invoice-info-text"> {invoiceInfo[0].company.reference}</span><br/>
</div>

 {/* <div className="invoice-info">
  <span className="invoice-info-header">TELEFON: </span><span className="invoice-info-text"> <b>{invoiceInfo[0].invoice_number}</b></span><br/>
  <span className="invoice-info-header">VÅR REFERENS: </span><span className="invoice-info-text"> <b>{{ sender.reference | safe }}</b></span><br/>
<span className="invoice-info-header">MOMS-REG-NR: </span><span className="invoice-info-text"> <b>{{ sender.moms_number | safe }}</b></span><span className="invoice-info-header-ref">KUNDENS REF: <b>{{ receiver.reference | safe }}</b></span> 
</div>
*/}
<div className="article-table">
  <table>
    <tr>
      <th>ART.NR</th>
      <th>BESKRIVNING</th>
      <th>KVANTITET</th>
      <th>ENHET</th>
      <th>Á-PRIS</th>
      <th>MOMS</th>
      <th>TOTALT</th>
    </tr>
    {invoiceInfo[1].map((articles) => (
  <tr>
      <td>{articles.product.product_number}</td>
       <td>{ articles.description }</td>
      <td>{ articles.amount }</td>
      <td>{ articles.unit }</td>
      <td>{ numberWithSpaces(articles.price) } SEK</td>
      <td>{ articles.moms } %</td>
      <td>{ numberWithSpaces(articles.total) } SEK</td> 
  </tr>
    ))}

  </table>
</div>

 
<div className="sum-table row">
<div className="col-2"><span className="amount-header-netto">Netto: </span><br/><span className="amount-netto"> {numberWithSpaces(invoiceInfo[0].netto)}</span></div>
<div className="col-2"><span className="amount-header-moms">Moms:</span><br/><span className="amount-moms"> {numberWithSpaces(invoiceInfo[0].moms)}</span></div>
<div className="col-2 offset-6"><span className="amount-header-total">ATT BETALA:</span><br/><span className="amount-number-total">SEK {numberWithSpaces(invoiceInfo[0].total)}</span></div><br/>
</div>
<div className="policy-text">
  <p>Denna faktura har skickats med faktureringstjänsten Billecta. Betalningsvillkor: 30 förfallodagar, dröjsmålsränta 8%. Betalning med befriande verkan ska ske till Billecta
Klientmedelskonto enligt denna faktura med angivande av OCR-nr/meddelande. Invändningar mot denna faktura ska göras senast 2021-11-10 till Deb (Bolaget). Frågor ska
ställas till Bolaget (xoinmqjwsbsceqbxhk@adfskj.com). Godkänd för F-skatt.</p>
</div>



<hr/>
<div className="payment-info">
<span><b>Företagsinformation:</b></span><br/>
<span class="payment-info-header">Org.nr: </span><span class="payment-info-text"> <b>{ invoiceInfo[0].company.org_number }</b></span><br/>
  <span class="payment-info-header">Moms.nr: </span><span class="payment-info-text"> <b>{ invoiceInfo[0].company.moms_number }</b></span><br/>
  <span class="payment-info-header">IBAN: </span><span class="payment-info-text"> <b>{ invoiceInfo[0].company.iban }</b></span><br/>
  </div>
<div className="payment-info float-right">
<span><b>Kundinformation:</b></span><br/>
<span class="payment-info-header">Org.nr: </span><span class="payment-info-text"> <b>{ invoiceInfo[0].customer.org_number }</b></span><br/>
  <span class="payment-info-header">Moms.nr: </span><span class="payment-info-text"> <b>{ invoiceInfo[0].customer.moms_number }</b></span><br/>
  <span class="payment-info-header">Kundnummer: </span><span class="payment-info-text"> <b>{ invoiceInfo[0].customer.customer_number}</b></span><br/>
  </div>
  </div>

  </div> 
  </div> 

  </>
  );
}

export default InvoiceById;
