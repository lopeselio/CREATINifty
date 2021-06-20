/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 */

//  const Kit = require('@celo/contractkit')
//  const kit = Kit.newKit('https://alfajores-forno.celo-testnet.org')
const web3 = new Web3('https://alfajores-forno.celo-testnet.org')
const kit = ContractKit.newKitFromWeb3(web3)
 
//  const getAccount = require('./utils/getAccount').getAccount
 
//  async function awaitWrapper(){
//      let account = await getAccount()
//      kit.connection.addAccount(account.privateKey)
//  }
//  awaitWrapper()
 
 module.exports = {
   /**
    * Networks define how you connect to your ethereum client and let you set the
    * defaults web3 uses to send transactions. If you don't specify one truffle
    * will spin up a development blockchain for you on port 9545 when you
    * run `develop` or `test`. You can ask a truffle command to use a specific
    * network from the command line, e.g
    *
    * $ truffle test --network <network-name>
    */
 
   networks: {
     //
     // development: {
     //  host: "127.0.0.1",     // Localhost (default: none)
     //  port: 8545,            // Standard Ethereum port (default: none)
     //  network_id: "*",       // Any network (default: none)
     // },
     test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    alfajores: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 44787
    },
     alfajores_network: {
       provider: kit.web3.currentProvider, // CeloProvider
       network_id: 44787                   // latest Alfajores network id
     }
   },
   contracts_directory: './src/contracts/',
    contracts_build_directory: './src/abis/',
 
   // Set default mocha options here, use special reporters etc.
   mocha: {
     // timeout: 100000
   },
 
   // Configure your compilers
   compilers: {
     solc: {
       version: "0.8.1",    
       // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
       settings: {          
        optimizer: {
          enabled: true,
          runs: 200
        },
       //  evmVersion: "byzantium"
       }
     }
   }
 }