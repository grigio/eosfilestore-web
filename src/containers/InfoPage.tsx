import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
// import { counterStore, routingStore } from '../stores'

// gif b5407140a0f7b6365b2dcf1731f6ad50ee0502d052ecdb9da01700ecd398f759
// a jpg 90edc50fac5a622820404e24f6839c7b9ca2bff73a3b1a11221caf85334aa6e6
// sh 987c4c9995e717df08ce82f4b24a2f814749f92113e7458124f29607cad0b77d
// welcome txt 9a9e4d3637cbecea36d7cf54d0cf8a7e8046f0b893a1d880800ec8312c7d9eb4

@observer
class InfoPage extends React.Component<any>{

  render() {



    return (
      <>
        <div className="txid row rowspace start-xs">
          <div className="col-xs-offset-1 col-xs-9">
            <div className="mybox box">
              <h2>Info</h2>
              <h3>Why should I store a file on EOS blockchain?</h3>
              <p>You don't have to, but if you do it, you have interesting features:
              </p>
              <ul>
                <li><strong>Immutability</strong>: Once you upload a file on the Blockchain it can't be edited.</li>
                <li><strong>Time proof</strong>: You can claim you had a file in a precise moment of the past. And the transaction is is your proof.</li>
                <li><strong>It's free</strong>: It doesn't cost EOS to upload a file, but you need enough EOS in staking in CPU and NET.</li>
              </ul>
            </div>
          </div>
        </div>

      </>
    )
  }
}

export default InfoPage