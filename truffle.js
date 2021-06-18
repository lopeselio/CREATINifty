require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: '0.6.7+commit.1d4f565a',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
  // compilers: {
  //   solc: {
  //     version: '0.8.0+commit.c7dfd78e',
  //     optimizer: {
  //       enabled: true,
  //       runs: 1
  //     }
  //   }
  // },
}
