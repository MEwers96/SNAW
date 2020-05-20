import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import Results from './Results';
import Information from "./Information";
import NotFound from "./NotFound";
import * as serviceWorker from './serviceWorker';

const routing = (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/results" component={Results} />
          <Route exact path="/information" component={Information} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
