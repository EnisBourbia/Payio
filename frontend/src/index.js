import React from 'react';
import ReactDOM from 'react-dom';
import { hydrate, render } from 'react-dom';
import Home from './home/index';
import Overview from './overview/index';
import Invoice from './invoice/view/index';
import CreateInvoice from './invoice/create/index';
import EditInvoice from './invoice/edit/index';
import CreateMassInvoice from './invoice/massCreate/index';
import CreateDealInvoice from './invoice/dealCreate/index';
import Settings from './settings/index';
import Store from './redux/Store'
import Bank from './bank/index'
import BankAccount from './bank/account'
import BankManage from './bank/manage'
import Login from './user/login'
import Register from './user/register'
import InvoiceById from './invoice/invoiceById/index'
import Transactions from './bank/transactions/index'
import Customer from './customer/index'
import Product from './product/index'
import Bookkeep from './bookkeep/index'
import Todo from './todo/index'
import Sidebar from './sidebar/index'
import { Provider } from 'react-redux'

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  hydrate(
<Router>
  <Switch>
    <Provider store={Store}>
  <Sidebar/>
      <Route path="/" exact component={Home}/>
      <Route path="/oversikt" exact component={Overview}/>
      <Route path="/registrera" exact component={Register}/>
      <Route path="/logga-in" exact component={Login}/>
      <Route path="/fakturering" exact component={Invoice}/>
      <Route path="/faktura/redigera/:id/:access_token" exact component={EditInvoice}/>
      <Route path="/faktura/:id/:access_token" exact component={InvoiceById}/>
      <Route path="/skapa-faktura" exact component={CreateInvoice}/>
      <Route path="/skapa-avtalsfaktura" exact component={CreateDealInvoice}/>
      <Route path="/skapa-massfaktura" exact component={CreateMassInvoice}/>
      <Route path="/bank/transaktioner" exact component={Transactions}/>
      <Route path="/kunder" exact component={Customer}/>
      <Route path="/produkter" exact component={Product}/>
      <Route path="/att-gora" exact component={Todo}/>
      <Route path="/bokforing" exact component={Bookkeep}/>
      <Route path="/installningar" exact component={Settings}/>
      <Route path="/bank" exact component={Bank}/>
      <Route path="/bank/konto/:account" exact component={BankAccount}/>
      <Route path="/bank/hantera" exact component={BankManage}/>
    </Provider>
  </Switch>
  </Router>, rootElement)

} else {
  render(
  <Router>
    <Switch>
    <Provider store={Store}>
    <Sidebar/>
      <Route path="/" exact component={Home}/>
      <Route path="/oversikt" exact component={Overview}/>
      <Route path="/registrera" exact component={Register}/>
      <Route path="/logga-in" exact component={Login}/>
      <Route path="/fakturering" exact component={Invoice}/>
      <Route path="/faktura/redigera/:id/:access_token" exact component={EditInvoice}/>
      <Route path="/faktura/:id/:access_token" exact component={InvoiceById}/>
      <Route path="/skapa-faktura" exact component={CreateInvoice}/>
      <Route path="/skapa-avtalsfaktura" exact component={CreateDealInvoice}/>
      <Route path="/skapa-massfaktura" exact component={CreateMassInvoice}/>
      <Route path="/kunder" exact component={Customer}/>
      <Route path="/bank/transaktioner" exact component={Transactions}/>
      <Route path="/produkter" exact component={Product}/>
      <Route path="/att-gora" exact component={Todo}/>
      <Route path="/bokforing" exact component={Bookkeep}/>
      <Route path="/installningar" exact component={Settings}/>
      <Route path="/bank" exact component={Bank}/>
      <Route path="/bank/konto/:account" exact component={BankAccount}/>
      <Route path="/bank/hantera" exact component={BankManage}/>
    </Provider>
    </Switch>
  </Router>, rootElement)
}
