// import fs from 'fs'

// function loadConfig() {
//   const confDir = `${process.env.HOME}/.eosfilestore`

//   // write default config.js in the first run
//   if (!fs.existsSync(confDir)) {
//     fs.mkdirSync(confDir)
//     fs.writeFileSync(`${confDir}/config.json`, `
// {
//   "from":"",
//   "privateKey":"",
//   "permission":"active"
// }
//     `)
//     console.log(`eosfilestore: Generated '${confDir}/config.json', please edit with your EOS keys`)
//   }

//   // read config
//   // const configFile = fs.readFileSync(`${confDir}/config.json`).toLocaleString()
//   const configFile = `{
//     "from":"",
//     "privateKey":"",
//     "permission":"active"
//   }`

//   return JSON.parse(configFile)

// }

const confObj = {
  chainId: null,
  "from": "",
  "privateKey": "",
  "permission": "active",
}

// console.log('cc', confObj)

export const maxPayloadSize = 10000 // 429496 // 176 // 4294967294
export const netPerTx = 1272
export const cpuPerTx = 20000 // it depends on net congestion


// export const chainId = confObj.chainId || 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' // mainnet
// export const wif = confObj.privateKey
// export const from = confObj.from
export const permission = confObj.permission || 'active'

function networkConfigFn() {
  const nc = {
    blockchain: 'eos',
    protocol: 'https',
    host: 'eos.greymass.com',
    port: 443,
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
  }
  return {
    ...nc,
    httpEndpoint: `${nc.protocol}://${nc.host}:${nc.port}`
  }
}

export const networkConfig: any = networkConfigFn()