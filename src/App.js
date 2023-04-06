import logo from './main2.jpeg';
import './App.css';

import Web3 from "web3";
import { useState, useEffect } from 'react';

import {ADDRESS, ABI} from "../config.js"

export default function Mint() {

  // FOR WALLET
  const [signedIn, setSignedIn] = useState(false)

  const [walletAddress, setWalletAddress] = useState(null)

  // FOR MINTING
  const [how_many_fecoliths, set_how_many_fecoliths] = useState(1)

  const [fecolithContract, setFecolithContract] = useState(null)

  // INFO FROM SMART Contract

  const [totalSupply, setTotalSupply] = useState(0)

  const [saleStarted, setSaleStarted] = useState(false)

  const [fecolithPrice, setFecolithPrice] = useState(0)

  useEffect( async() => { 

    signIn()

  }, [])

  async function signIn() {
    if (typeof window.web3 !== 'undefined') {
      // Use existing gateway
      window.web3 = new Web3(window.ethereum);
     
    } else {
      alert("No Ethereum interface injected into browser. Read-only access");
    }

    window.ethereum.enable()
      .then(function (accounts) {
        window.web3.eth.net.getNetworkType()
        // checks if connected network is mainnet (change this to rinkeby if you wanna test on testnet)
        .then((network) => {console.log(network);if(network != "main"){alert("You are on " + network+ " network. Change network to mainnet or you won't be able to do anything here")} });  
        let wallet = accounts[0]
        setWalletAddress(wallet)
        setSignedIn(true)
        callContractData(wallet)

  })
  .catch(function (error) {
  // Handle error. Likely the user rejected the login
  console.error(error)
  })
  }

//

  async function signOut() {
    setSignedIn(false)
  }
  
  async function callContractData(wallet) {
    // let balance = await web3.eth.getBalance(wallet);
    // setWalletBalance(balance)
    const fecolithContract = new window.web3.eth.Contract(ABI, ADDRESS)
    setFecolithContract(fecolithContract)

    const salebool = await fecolithContract.methods.saleIsActive().call() 
    // console.log("saleisActive" , salebool)
    setSaleStarted(salebool)

    const totalSupply = await fecolithContract.methods.totalSupply().call() 
    setTotalSupply(totalSupply)

    const fecolithPrice = await fecolithContract.methods.fecolithPrice().call() 
    setFecolithPrice(fecolithPrice)
   
  }
  
  async function mintFecolith(how_many_fecoliths) {
    if (fecolithContract) {
 
      const price = Number(fecolithPrice)  * how_many_fecoliths 

      const gasAmount = await fecolithContract.methods.mintFecolith(how_many_fecoliths).estimateGas({from: walletAddress, value: price})
      console.log("estimated gas",gasAmount)

      console.log({from: walletAddress, value: price})

      fecolithContract.methods
            .mintFecolith(how_many_fecoliths)
            .send({from: walletAddress, value: price, gas: String(gasAmount)})
            .on('transactionHash', function(hash){
              console.log("transactionHash", hash)
            })
          
    } else {
        console.log("Wallet not connected")
    }
    
  };

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
            </p>
        <p>
            FECOLITHS
            </p>
        <p>
            Fertilizing the metaverse with meme poo art. Just for fun!
            </p>
        <p>
            Start fertilizing web3 by minting your fecolith!
              </p>
        <a
          className="App-link"
          href="https://etherscan.io/address/0xd03b4d6fa512f960fd815c1a4f100f056bfe8eae#writeContract"
          target="_blank"
          rel="noopener noreferrer"
        >
          MINT
        </a>
      </header>
    </div>
  );
}

export default App;
