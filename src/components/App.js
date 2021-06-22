import Creatinifty from '../abis/Creatinifty.json'
import React, { Component } from 'react';
import Identicon from 'identicon.js';
import Navbar from './Navbar'
import Main from './Main'
//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
// const Web3 = require("web3")
// const Web3 = require('web3')
// const ContractKit = require('@celo/contractkit')
// const web3 = new Web3('https://alfajores-forno.celo-testnet.org')
const Web3 = require("web3")
const ContractKit = require("@celo/contractkit")
let BigNumber = require("bignumber.js")
let erc20Abi = require("../abis/erc20Abi.json")

const ERC20_DECIMALS = 18
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

let kit
let cUSDcontract

let anAddress = '0xD86518b29BB52a5DAC5991eACf09481CE4B0710d'
let amount = "10000000000000000"


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      creatinifty: null,
      images: [],
      loading: true
    }
    this.connectCeloWallet()
    // this.loadWeb3()
    this.loadBlockchainData()
    this.uploadImage = this.uploadImage.bind(this)
    this.tipImageOwner = this.tipImageOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }
  
  // async componentWillMount() {
  //   await this.connectCeloWallet()
  //   await this.loadWeb3()
  //   await this.loadBlockchainData()
  // }

  async connectCeloWallet() {
    if (window.celo) {
      try {
        await window.celo.enable()
  
        const web3 = new Web3(window.celo)
        // console.log(web3)
        kit = ContractKit.newKitFromWeb3(web3)
        // console.log(kit)
        // console.log(ContractKit)
        // console.log("Hello")
  
        const accounts = await kit.web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        console.log(accounts)
        
        kit.defaultAccount = accounts[0]
        // console.log(kit.defaultAccount)
        // console.log(accounts)
  
        cUSDcontract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)
        // console.log(cUSDcontract)
        
        // getBalance()
      } catch (error) {
        console.log(`⚠️ ${error}.`)
      }
    } else {
      console.log("⚠️ Please install the CeloExtensionWallet.")
    }
  }

  // async loadWeb3() {
  //   if (window.celo) {
  //     window.web3 = new Web3(window.celo)
  //     await window.celo.enable()
  //     // console.log("hello")
  //   }
  //   else if (window.web3) {
  //     window.web3 = new Web3(window.web3.currentProvider)
  //     console.log("hallo")
  //   }
  //   else {
  //     window.alert('Non-Ethereum browser detected. You should consider trying celo Extension wallet!')
  //     console.log("Hello")
  //   }
  // }

  async loadBlockchainData() {
    // const web3 = window.web3
    // Load account
    const web3 = new Web3(window.celo)
    kit = ContractKit.newKitFromWeb3(web3)
    // console.log(kit)
    // const accounts = await kit.web3.eth.getAccounts()
    // console.log(accounts)
    // kit.defaultAccount = accounts[0]
    // this.setState({ account: accounts[0] })
    // console.log(this.state.account)
    // console.log(kit.defaultAccount)
    // Network ID
    const networkId = await kit.web3.eth.net.getId()
    console.log(networkId)
    const networkData = Creatinifty.networks[networkId]
    if(networkData) {
      cUSDcontract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)
      // getBalance()
      const creatinifty = new kit.web3.eth.Contract(Creatinifty.abi, networkData.address)
      this.setState({ creatinifty })
      const imagesCount = await creatinifty.methods.imageCount().call()
      this.setState({ imagesCount })
      // Load images
      for (var i = 1; i <= imagesCount; i++) {
        const image = await creatinifty.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      // Sort images. Show highest tipped images first
      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false})
    } else {
      window.alert('Creatinifty contract not deployed to detected network.')
    }
  }



  // async loadBlockchainData() {
  //   const web3 = window.web3
  //   // Load account
  //   const accounts = await web3.eth.getAccounts()
  //   this.setState({ account: accounts[0] })
  //   // Network ID
  //   const networkId = await web3.eth.net.getId()
  //   const networkData = Creatinifty.networks[networkId]
  //   if(networkData) {
  //     const creatinifty = new web3.eth.Contract(Creatinifty.abi, networkData.address)
  //     this.setState({ creatinifty })
  //     const imagesCount = await creatinifty.methods.imageCount().call()
  //     this.setState({ imagesCount })
  //     // Load images
  //     for (var i = 1; i <= imagesCount; i++) {
  //       const image = await creatinifty.methods.images(i).call()
  //       this.setState({
  //         images: [...this.state.images, image]
  //       })
  //     }
  //     // Sort images. Show highest tipped images first
  //     this.setState({
  //       images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount )
  //     })
  //     this.setState({ loading: false})
  //   } else {
  //     window.alert('Creatinifty contract not deployed to detected network.')
  //   }
  // }

  async getBalance() {
    const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
    const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
    // document.querySelector("#balance").textContent = cUSDBalance
  }

  async send() {
    let celoAddress = document.getElementById("addr").value
    let sendamount
    const web3 = new Web3(window.celo)
    // sendamount = document.getElementById("amt").value
    sendamount = web3.utils.toWei(sendamount, 'ether');
    console.log(sendamount)
    const result = await cUSDcontract.methods
      .transfer(celoAddress, sendamount)
      .send({ from: kit.defaultAccount })
    
    return result
  }

  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = description => {
    console.log("Submitting file to ipfs...")

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.creatinifty.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  // tipImageOwner(id, tipAmount) {
  //   this.setState({ loading: true })
  //   this.state.creatinifty.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
  //     this.setState({ loading: false })
  //   })
  // }

  async tipImageOwner(id, tipAmount) {
    this.setState({ loading: true })
    let celoAddress = document.getElementById("addr").value
    let sendamount
    const web3 = new Web3(window.celo)
    // sendamount = document.getElementById("amt").value
    sendamount = web3.utils.toWei(sendamount, 'ether');
    console.log(sendamount)
    const result = await cUSDcontract.methods
      .transfer(celoAddress, sendamount)
      .send({ from: kit.defaultAccount })
    
    return result
    // this.state.creatinifty.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
    this.setState({ loading: false })
    }
  

  

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          
          : <Main
              images={this.state.images}
              captureFile={this.captureFile}
              uploadImage={this.uploadImage}
              tipImageOwner={this.tipImageOwner}
            />
        }
      </div>
    );
  }
}

export default App;
