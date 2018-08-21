import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import { Button, InputGroup, ProgressBar, Intent, Icon } from "@blueprintjs/core";
import { observer } from 'mobx-react';
import { fileStore } from '../stores';
// import { counterStore, routingStore } from '../stores'

// gif b5407140a0f7b6365b2dcf1731f6ad50ee0502d052ecdb9da01700ecd398f759
// a jpg 90edc50fac5a622820404e24f6839c7b9ca2bff73a3b1a11221caf85334aa6e6
// sh 987c4c9995e717df08ce82f4b24a2f814749f92113e7458124f29607cad0b77d
// welcome txt 9a9e4d3637cbecea36d7cf54d0cf8a7e8046f0b893a1d880800ec8312c7d9eb4

@observer
class DownloadPage extends React.Component<any>{
  componentDidMount() {
    const txid = this.props.match.params.txid
    // NOTE: auto fetch if the url provide txid
    if (txid) {
      fileStore.setTxid(txid)
      fileStore.fetchData()
    } else {
      fileStore.reset()
    }
  }

  render() {

    const downloadButton: any = (
      <Button
        disabled={fileStore.newTxid.length > 0 ? false : true}
        icon="arrow-right"
        minimal={true}
        intent={Intent.PRIMARY}
        onClick={() => {
          fileStore.fetchData()
        }} />
    )

    const cleanButton: any = (
      <Button
        disabled={fileStore.newTxid.length > 0 ? false : true}
        icon="cross"
        minimal={true}
        onClick={() => {
          // fileStore.fetchData()
          fileStore.cleanTxid()
        }} />
    )

    const buttonGroup: any = (
      <>
        {cleanButton}
        {downloadButton}
      </>
    )

    return (
      <>
        <div className="txid row rowspace start-xs">
          <div className="col-xs-offset-1 col-xs-9">
            <div className="mybox box">
              <h2>
                Type or paste below the first EOS transaction id containing the file
              </h2>
              <p>Hint: try 16d1fd7fc2d3ccc4a2141ba71ce32a96a30f848838bb6879ca2967905e97d7ca</p>
              <InputGroup
                large={true}
                leftIcon="search"
                onChange={this.onTxidChange}
                onKeyPress={this.onEnterKey}
                placeholder="Insert File txid..."
                // rightElement={maybeSpinner}
                value={fileStore.newTxid}
                rightElement={buttonGroup}
                intent={fileStore.isErrorState ? Intent.DANGER : Intent.NONE}
              />
            </div>
          </div>
        </div>

        <div className="loading row rowspace start-xs">
          <div className="col-xs-offset-1 col-xs-9">
            {fileStore.isLoading ? (
              <div className="mybox box">
                <h2>
                  Fetching the file transactions
                </h2>
                {/* Maybe a component */}
                {fileStore.transactions.map((t:any) => (
                  <p key={t}>{t}</p>
                ))}
                <ProgressBar
                  animate={fileStore.isLoading}
                  value={100} />
              </div>
            ) : null}

          </div>
        </div>

        <div className="filedetails row rowspace start-xs">
          <div className="col-xs-offset-1 col-xs-9">
            {fileStore.blob.length > 0 ? (
              <div className="mybox box">
                <h2>File Details</h2>
                <p>
                  Congratulation! The file has been correctly downloaded from the EOS blockchain.
                  <strong>Please open in new tab the link contained in the icon (via tap or right click)</strong>
                </p>

                <div className="row center-xs">
                  <div className="col-xs end-xs">

                    <a href={fileStore.blob}><Icon icon="cloud-download" className="pulse-animation" iconSize={100} /></a>
                  </div>
                  <div className="col-xs-8 start-xs">
                    Upload date: {fileStore.fileMetadata.block_time}<br />
                    Account: {fileStore.fileMetadata.upload_by}<br />
                    Total CPU: {fileStore.fileMetadata.cpu_usage_us}<br />
                    Total NET: {fileStore.fileMetadata.net_usage_words}<br />
                    Share <a href={`/download/${fileStore.newTxid}`}>direct link</a> <Icon icon="share" />
                  </div>

                </div>

                <h2>File preview</h2>
                <p>
                  The preview supports only images and videos
                </p>
                {fileStore.blob.slice(0, 10) === "data:video" ? (
                  <div className="previewer row start-xs">
                    <div className="col-xs start-xs">
                      <video style={{ width: '100%' }} src={`${fileStore.blob}`} controls={true} />
                    </div>
                  </div>
                ) : null}

                {fileStore.blob.slice(0, 10) === "data:image" ? (
                  <div className="previewer row start-xs">
                    <div className="col-xs start-xs">
                      <img style={{ width: '100%' }} src={`${fileStore.blob}`} alt="" />
                    </div>
                  </div>
                ) : null}

              </div>
            ) : null}
          </div>
        </div>


        ...
        {/* <Button onClick={() => {
          counterStore.increment()
          routingStore.replace(`/counter/${counterStore.counter.toString()}`)
        }} >Counter: {counterStore.counter}
        </Button> */}
      </>
    )
  }

  private onTxidChange(ev: any) {
    fileStore.setTxid(ev.target.value)
  }

  private onEnterKey(ev: any) {
    if (ev.key === "Enter") {
      fileStore.fetchData()
    }

  }
}

export default DownloadPage