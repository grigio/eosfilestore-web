// import * as Base64 from 'base64-js'
// import * as fs from "fs";
// import mime from 'mime-types'
// const Eos = require('eosjs')
import * as Eos from 'eosjs'
import { splitString } from './utils'
import { networkConfig, netPerTx, cpuPerTx } from './costants'

const contractName = 'eosfilestore'
/* tslint:disable */
const ScatterJS = require('scatter-js/dist/scatter.cjs')

const eos = Eos(networkConfig)

function contractReady(contractName: string): any {
  return new Promise((resolve: any) => {
    ScatterJS.scatter.connect(contractName).then((connected: any) => {
      if (!connected) {
        console.error('Scatter not active')
      }

      ScatterJS.scatter.getIdentity({ accounts: [networkConfig] }).then((identity: any) => {
        const account = identity.accounts.find((acc: any) => acc.blockchain === 'eos')
        const eoss = ScatterJS.scatter.eos(networkConfig, Eos, { broadcast: true, chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' }, "http");
        // const eoss = ScatterJS.scatter.eos(networkConfig, Eos)

        eoss.contract(contractName).then((contract: any) => {
          // contract.upload(memo, options).then((res: any) => {
          resolve({ contract, account })
          // })
        })
      })

    })
  })
}


export function doTx(memo: string, account: any): Promise<any> {
  return new Promise((resolve: any) => {
    contractReady(contractName).then(({ contract, account }: any) => {
      const options = {
        authorization: [`${account.name}@${account.authority}`]
      }

      contract.upload(memo, options).then((res: any) => {
        resolve(res)
      })
    })
  })
}

export function estimateBlob(blob: string): any {
  const chunks = splitString(blob)
  return {
    cpu_usage_us: `${cpuPerTx * chunks.length} μs (it depends on net congestion)`,
    net_usage_words: `${netPerTx * chunks.length} bytes (${chunks.length} txs)`,
    num_txs: chunks.length
  }
}

export function fetchTx(txid: string, callback: any, buffer?: string, fm?: any): Promise<any> {
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
      callback(memo.n)
      if (memo.n) {
        resolve(fetchTx(memo.n, callback, `${buffer}${memo.c}`, fileMetadata))
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


/*

{
  "broadcast": true,
  "transaction": {
    "compression": "none",
    "transaction": {
      "expiration": "2018-08-02T13:28:34",
      "ref_block_num": 25582,
      "ref_block_prefix": 3813040338,
      "net_usage_words": 0,
      "max_cpu_usage_ms": 0,
      "delay_sec": 0,
      "context_free_actions": [],
      "actions": [
        {
          "account": "eosfilestore",
          "name": "upload",
          "authorization": [
            {
              "actor": "gq4dmnjzgige",
              "permission": "active"
            }
          ],
          "data": "09646574737461736132"
        }
      ],
      "transaction_extensions": []
    },
    "signatures": [
      "SIG_K1_K6xtddLWTfRZHubGcfcRZDQB21E7Tew46QSKZkQ52guCSvhpVHbNzhuMgNo3BuWabN7K9bViEkHLqWxXito448SXie18iE"
    ]
  },
  "transaction_id": "bc4c0aa870fa922a9d2bdc59fcc90911638c38f9a67fbd05ce04ad54765cccf6",
  "processed": {
    "id": "bc4c0aa870fa922a9d2bdc59fcc90911638c38f9a67fbd05ce04ad54765cccf6",
    "receipt": {
      "status": "executed",
      "cpu_usage_us": 450,
      "net_usage_words": 13
    },
    "elapsed": 450,
    "net_usage": 104,
    "scheduled": false,
    "action_traces": [
      {
        "receipt": {
          "receiver": "eosfilestore",
          "act_digest": "154eec21519da8015f9ffdd82f16a6c35735a8316bee681456d8444483afa648",
          "global_sequence": 149343810,
          "recv_sequence": 87,
          "auth_sequence": [
            [
              "gq4dmnjzgige",
              563
            ]
          ],
          "code_sequence": 1,
          "abi_sequence": 1
        },
        "act": {
          "account": "eosfilestore",
          "name": "upload",
          "authorization": [
            {
              "actor": "gq4dmnjzgige",
              "permission": "active"
            }
          ],
          "data": {
            "msg": "detstasa2"
          },
          "hex_data": "09646574737461736132"
        },
        "elapsed": 182,
        "cpu_usage": 0,
        "console": "",
        "total_cpu_usage": 0,
        "trx_id": "bc4c0aa870fa922a9d2bdc59fcc90911638c38f9a67fbd05ce04ad54765cccf6",
        "inline_traces": []
      }
    ],
    "except": null
  },
  "returnedFields": {
    "accounts": [
      {
        "name": "gq4dmnjzgige",
        "authority": "active",
        "blockchain": "eos"
      }
    ]
  }
}

*/