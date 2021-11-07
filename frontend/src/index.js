import React from 'react';
import ReactDOM from 'react-dom';
import { hydrate, render } from 'react-dom';
import Home from './home/index';
import Invoice from './invoice/view/index';
import CreateInvoice from './invoice/create/index';
import EditInvoice from './invoice/edit/index';
import CreateMassInvoice from './invoice/massCreate/index';
import CreateDealInvoice from './invoice/dealCreate/index';
import Settings from './settings/index';
import Store from './redux/Store'
import Integration from './integration/index'
import Login from './user/login'
import Register from './user/register'
import InvoiceById from './invoice/invoiceById/index'
import Payment from './payment/index'
import Customer from './customer/index'
import Product from './product/index'
import BookKeep from './bookKeep/index'

import { Provider } from 'react-redux'

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  hydrate(
<Router>
  <Switch>
    <Provider store={Store}>
      <Route path="/" exact component={Home}/>
      <Route path="/registrera" exact component={Register}/>
      <Route path="/logga-in" exact component={Login}/>
      <Route path="/faktura" exact component={Invoice}/>
      <Route path="/faktura/redigera/:id/:access_token" exact component={EditInvoice}/>
      <Route path="/faktura/:id/:access_token" exact component={InvoiceById}/>
      <Route path="/skapa-faktura" exact component={CreateInvoice}/>
      <Route path="/skapa-avtalsfaktura" exact component={CreateDealInvoice}/>
      <Route path="/skapa-massfaktura" exact component={CreateMassInvoice}/>
      <Route path="/betalningar" exact component={Payment}/>
      <Route path="/kunder" exact component={Customer}/>
      <Route path="/produkter" exact component={Product}/>
      <Route path="/bokforing" exact component={BookKeep}/>
      <Route path="/installningar" exact component={Settings}/>
      <Route path="/integration" exact component={Integration}/>
    </Provider>
  </Switch>
  </Router>, rootElement)

} else {
  render(
  <Router>
    <Switch>
    <Provider store={Store}>
      <Route path="/" exact component={Home}/>
      <Route path="/registrera" exact component={Register}/>
      <Route path="/logga-in" exact component={Login}/>
      <Route path="/faktura" exact component={Invoice}/>
      <Route path="/faktura/redigera/:id/:access_token" exact component={EditInvoice}/>
      <Route path="/faktura/:id/:access_token" exact component={InvoiceById}/>
      <Route path="/skapa-faktura" exact component={CreateInvoice}/>
      <Route path="/skapa-avtalsfaktura" exact component={CreateDealInvoice}/>
      <Route path="/skapa-massfaktura" exact component={CreateMassInvoice}/>
      <Route path="/kunder" exact component={Customer}/>
      <Route path="/betalningar" exact component={Payment}/>
      <Route path="/kunder" exact component={Customer}/>
      <Route path="/produkter" exact component={Product}/>
      <Route path="/bokforing" exact component={BookKeep}/>
      <Route path="/installningar" exact component={Settings}/>
      <Route path="/integration" exact component={Integration}/>
    </Provider>
    </Switch>
  </Router>, rootElement)
}
