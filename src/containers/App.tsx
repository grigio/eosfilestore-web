import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom'

import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";

import './App.css';
// import logo from './eosfilestore.svg';

// import { Link } from 'react-router-dom';

@inject('routing', 'fileStore')
@observer
export class App extends React.Component<any> {
  render() {
    return (
      <div className="App row center-xs">
        {/* <header className="App-header row">
          <div className="col-lg-12">
            <div className="box">
              <img className="App-logo" src={logo} alt="EOSfilestore" />
            </div>
          </div>
        </header> */}


        <div className="App-wrapper row center-xs">
          <div className="col-xs-10">
            <Navbar>
              <NavbarGroup align={Alignment.RIGHT}>
                <NavbarHeading>EOSfilestore</NavbarHeading>
                <NavbarDivider />
                <Link to="/info">
                  <Button
                    className={Classes.MINIMAL}
                    icon="info-sign"
                    text="Info"
                    active={location.pathname.startsWith('/info')}
                  />
                </Link>
                <Link to="/download">
                  <Button
                    className={Classes.MINIMAL}
                    icon="download"
                    text="Download"
                    active={location.pathname.startsWith('/download')}
                  />
                </Link>
                <Button disabled={true} className={Classes.MINIMAL} icon="cloud-upload" text="Upload" />
                <Navbar.Divider />
                <Button disabled={true} className={Classes.MINIMAL} icon="log-in" text="Login with Scatter" />
              </NavbarGroup>
            </Navbar>
          </div>
        </div> {/* /App-wrapper */}



        <div className="row center-xs fill">
          <div className="col-xs-10">
            <div className="box">
              {this.props.children}
            </div>
          </div>
        </div>

        <div className="App-footer row fill center-xs">
          <div className="footercenter row col-sm-9 start-xs">
            <div className="col-xs-12 col-sm">
              <h2>Usage</h2>
              <p>
                You need to upload the file via <a href="https://github.com/grigio/eosfilestore-web">EOSfilestore</a> CLI to get the txid
              </p>
            </div>
            <div className="col-xs-12 col-sm">
              <div className="box">
                <h2>Source Code</h2>
                <p>
                  <a href="https://github.com/grigio/eosfilestore-web">EOSfilestore Web</a> is on Github.
              </p>
              </div>
            </div>
            <div className="col-xs-12 col-sm">
              <div className="box">
                <h2>Support</h2>
                If you like EOSfilestore you can fund the development with an EOS donation to <strong>@eosfilestore</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// NOTE: hack https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md#quick-solution
export default withRouter(App)