// import * as Base64 from 'base64-js'
// import * as fs from "fs";
// import mime from 'mime-types'
// const Eos = require('eosjs')
import * as Eos from 'eosjs'
// import { splitString } from './utils'
import { chainId, from, wif, permission } from './costants'

const config = {
  chainId,
  keyProvider: [wif],
  httpEndpoint: 'https://api.eosnewyork.io',
  // TODO: changeable https://api.eosnewyork.io https://nodes.get-scatter.com
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
}

const eos = Eos(config)

export function doTx(memo: string): Promise<any> {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      // eos.transfer(from, 'eosfilestore', '0.0001 EOS', memo, (error: any, result: any) => {
      //   if (error) {
      //     console.error(error)
      //   }
      //   // console.log('..',JSON.stringify(result))
      //   resolve(result)
      // })

      const options = {
        authorization: [`${from}@${permission}`]
      }
      eos.contract('eosfilestore').then((contract: any) => {
        contract.upload(memo, options).then((res: any) => {
          resolve(res)
        })
      });

    }, 100); // NOTE: rate limit?
  })
}

// just to test promises
// async function fakeTransferPromise(memo: string): Promise<any> {
//   return new Promise((resolve: any) => {
//     setTimeout(async () => {
//       await resolve({ transaction_id: Math.random().toString() })
//     }, 2000);
//   })
// }

export function fetchTx(txid: string, buffer?: string, fm?: any): Promise<any> {
  return new Promise((resolve: any, reject: any) => {
    eos.getTransaction(txid).then((data: any) => {
      const fmd = {
        cpu_usage_us: (fm) ? fm.cpu_usage_us : 0,
        net_usage_words: (fm) ? fm.net_usage_words : 0,
      }
      // console.log(JSON.stringify(data.trx.trx.actions[0].data.msg))
      // console.log(data.trx.trx.actions[0].data.memo) // data.trx.trx.actions[0].data.memo

      // const memo = JSON.parse(data.trx.trx.actions[0].data.memo)
      // OK
      // setTimeout(() => {
      // console.log('l ', data.trx.trx.actions[0].data.memo)
      const toParse = data.trx.trx.actions[0].data.msg
      // console.log(toParse)
      const memo = JSON.parse(toParse)
      const fileMetadata = {
        block_time: data.block_time,
        cpu_usage_us: fmd.cpu_usage_us + data.trx.receipt.cpu_usage_us,
        net_usage_words: fmd.net_usage_words + data.trx.receipt.net_usage_words,
        upload_by: data.trx.trx.actions[0].authorization[0].actor
      }
      // debugger
      console.log(`${memo.n}`) // verbose
      if (memo.n) {
        resolve(fetchTx(memo.n, `${buffer}${memo.c}`, fileMetadata))
      } else {
        resolve({ data: `${buffer}${memo.c}`, fileMetadata })
        // return false
      }
      // }, 100)

    }).catch((e: any) => reject(e))
  })
}

export function prepareChunks(filepath: string): Promise<string[]> {
  return new Promise((resolve: any, reject: any) => {
    resolve([])
    // fs.readFile(filepath, (err: any, data: Uint8Array) => {
    //   if (err) {
    //     console.error(err)
    //     reject([])
    //   }
    //   const blob = Base64.fromByteArray(data);
    //   const mimetype = mime.lookup(filepath)
    //   const dataString = `data:${mimetype};base64,${blob}`
    //   // console.log(dataString)
    //   const chunks = splitString(dataString, maxPayloadSize);

    //   resolve(chunks)
    // });
  })
}