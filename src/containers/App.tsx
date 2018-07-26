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
                <Link to="/download">
                  <Button className={Classes.MINIMAL} icon="download" text="Download" />
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

        <div className="App-footer row fill">
          <div className="col-xs-12 col-sm">
            <div className="box">.</div>
          </div>
          <div className="col-xs-12 col-sm">
            <div className="box">.</div>
          </div>
          <div className="col-xs-12 col-sm">
            <div className="box">.</div>
          </div>
        </div>
      </div>
    );
  }
}

// NOTE: hack https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md#quick-solution
export default withRouter(App)