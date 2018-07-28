import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { syncHistoryWithStore } from 'mobx-react-router';
import { Router, Route } from 'react-router';
import { Redirect } from 'react-router-dom'

import App from './containers/App';
import DownloadPage from './containers/DownloadPage'
import InfoPage from './containers/InfoPage'

import { routingStore, browserHistory, fileStore } from './stores'
import registerServiceWorker from './registerServiceWorker';

import './index.css';

// Stores

const stores = {
  fileStore,
  routing: routingStore,
};

const history = syncHistoryWithStore(browserHistory, routingStore);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <>

        <App>
          <Route path="/download/:txid?" component={DownloadPage} />
          <Route path="/info" component={InfoPage} />

          <Route exact={true} path="/" render={() => (
            <Redirect to="/download" />
          )} />
        </App>

      </>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
