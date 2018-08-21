import { observable, action } from 'mobx'
import { fetchTx } from '../eosfilestore/core'
import { notificationStore } from '.';

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