import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import { ProgressBar, Icon, FileInput, Callout, Intent } from "@blueprintjs/core";
import { observer, inject } from 'mobx-react';
import { fileStore, notificationStore } from '../stores';
import { arrayBufferToBase64, splitString, createPayload } from '../eosfilestore/utils'
import { doTx } from '../eosfilestore/core'
import { userStore } from '../stores';

// import { counterStore, routingStore } from '../stores'

// gif b5407140a0f7b6365b2dcf1731f6ad50ee0502d052ecdb9da01700ecd398f759
// a jpg 90edc50fac5a622820404e24f6839c7b9ca2bff73a3b1a11221caf85334aa6e6
// sh 987c4c9995e717df08ce82f4b24a2f814749f92113e7458124f29607cad0b77d
// welcome txt 9a9e4d3637cbecea36d7cf54d0cf8a7e8046f0b893a1d880800ec8312c7d9eb4
@inject('userStore')
@observer
class UploadPage extends React.Component<any>{
  componentDidMount() {
    const txid = this.props.match.params.txid
    // NOTE: auto fetch if the url provide txid
    if (txid) {
      fileStore.setTxid(txid)
      fileStore.fetchData()
    }
  }

  render() {



    return (
      <>
        <div className="txid row rowspace start-xs">
          <div className="col-xs-offset-1 col-xs-9">
            <div className="mybox box">
              <h2>
                Select the file to upload
              </h2>
              <p>
                Please read <strong>Info & FAQ</strong> before the usage, and try it first with a small file of a few Kb.
              </p>
              <FileInput
                large={true}
                text="Choose file..."
                onInputChange={(event: any) => {
                  // const type = event.target.files[0].type
                  


                  notificationStore.push({ title: 'Scatter is opening..', message: 'You need to confirm all the windows to successfully upload the file.' })
                  const file = event.target.files[0];
                  console.log(file, event)
                  const fr = new FileReader();
                  fr.onloadend = async (data) => {
                    if (data.target) {
                      const fileB64 = arrayBufferToBase64(data.target.result, file.type)
                      // senza type
                      console.log(fileB64) // split and send
                      const chunks = splitString(fileB64, 1950)
                      let nextTx: string | null = null
                      let counter = 0
                      for (const chunk of chunks.reverse()) {

                        try {
                          const memo = createPayload(chunk, nextTx)
                          const doneTx: any = await doTx(memo, userStore.account)
                          const cpu = doneTx.processed.receipt.cpu_usage_us
                          const net = doneTx.processed.receipt.net_usage_words

                          // NOTE: needed for better cli formatting
                          console.log(`${counter}. ${nextTx}
                     ${doneTx.transaction_id} cpu: ${cpu} net:${net}`)
                          nextTx = doneTx.transaction_id
                          counter += 1
                        } catch (err) {
                          console.log(`eosfilestore ERROR: ${JSON.stringify(err, null, 2)}`)
                          return
                        }

                      }
                      if (nextTx) {
                        fileStore.setTxid(nextTx)
                      }
                      console.log(`Done, uploaded in ${nextTx}`)



                    }
                    // debugger
                    // if (data.target) {
                    //   console.log('dd',
                    //     // fr.readAsDataURL(data.target.result)
                    //   )
                    // }
                  }
                  fr.readAsArrayBuffer(file);
                }} />
              {fileStore.newTxid ? (
                <Callout
                  intent={Intent.SUCCESS}
                  icon="tick"
                  title={"Congrats! Your file has been uploaded on EOS blockchain"}
                >
                  Save the `txid` below as receipt proof or to download the file again <br />
                  {fileStore.newTxid}
                </Callout>
              ) : null}
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
                {fileStore.blob.slice(0, 10) === "data:image" ? (
                  <div className="previewer row start-xs">
                    <div className="col-xs start-xs">
                      <img style={{ width: '100%' }} src={`${fileStore.blob}`} alt="" />
                    </div>
                  </div>
                ) : (
                    <p>Preview not available. You can try to open the data on a new tab or download it.</p>
                  )}
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


}

export default UploadPage