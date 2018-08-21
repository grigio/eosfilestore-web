import { observable, action } from 'mobx'
import { fetchTx } from '../eosfilestore/core'
import { notificationStore } from '.';

import { doTx } from '../eosfilestore/core'
import { userStore } from '../stores';
import { splitString, createPayload } from '../eosfilestore/utils';

// import { counterStore, routingStore } from '.'

// interface

class FileStore {
  @observable transactions: any = []
  @observable newTxid = ''
  @observable blob = ''
  @observable fileMetadata = {
    block_time: '...',
    cpu_usage_us: '...',
    net_usage_words: '...',
    upload_by: '...',
  }
  @observable isLoading = false
  @observable counter = Number(location.href.split(/\//)[4]) || 1
  @observable isOk = true
  @observable isErrorState = false

  @action setTxid(txid: string) {
    this.newTxid = txid
    // async start here
  }

  @action setBlob(blob: string) {
    this.blob = blob
    // async start here
  }

  // NOTE: Upload should spin load until all tx uploaded
  @action async uploadFile() {
    const fileB64 = this.blob
    const chunks = splitString(fileB64, 1950)
    let nextTx: string | null = null
    let counter = 0

    notificationStore.push({ title: 'Scatter is opening..', message: 'You need to confirm all the windows to successfully upload the file.' })

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
    // async start here
  }

  @action fetchData() {
    this.isLoading = true
    this.isErrorState = false
    this.blob = ''
    const context = this
    function callback(tx: any) {
      context.transactions.push(tx)
    }
    fetchTx(this.newTxid, callback).then(({ data, fileMetadata }) => {
      console.log('ddd', data)
      this.blob = data.slice(9)
      this.isLoading = false
      this.fileMetadata = fileMetadata
      console.log('f', fileMetadata)
      // window.open(data.slice(9,))
      // return false
      // const red = Base64.toByteArray(data)
      // window.open(data.slice(9,))
      // console.log(red)
      // exists()
    }).catch(e => {
      this.isLoading = false
      this.isErrorState = true
      notificationStore.push({ message: 'Error fetching tx via API' })
      console.error('ERROR: ', e)
    })
  }

  @action cleanTxid() {
    this.newTxid = ''
    this.blob = ''
  }

  @action reset() {
    this.blob = ''
    this.newTxid = ''
    this.transactions = []
  }

}
export const fileStore = new FileStore()