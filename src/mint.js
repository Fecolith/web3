import Head from 'next/head'
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

  return (
    <div id="bodyy" className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Fecoliths</title>
        <link rel="icon" href="/images/favicon3.png" />

        <meta property="og:title" content="Fecoliths" key="ogtitle" />
        <meta property="og:description" content="Mint Fecoliths!" key="ogdesc" />
        <meta property="og:type" content="website" key="ogtype" />
        <meta property="og:url" content="https://fecoliths.com/" key="ogurl"/>
        <meta property="og:image" content="https://fecoliths.com/images/main2.jpeg/" key="ogimage"/>
        <meta property="og:site_name" content="https://fecoliths.com/" key="ogsitename" />

        <meta name="twitter:card" content="summary_large_image" key="twcard"/>
        <meta property="twitter:domain" content="fecoliths.com" key="twdomain" />
        <meta property="twitter:url" content="https://fecoliths.com/" key="twurl" />
        <meta name="twitter:title" content="Fecoliths" key="twtitle" />
        <meta name="twitter:description" content="Fecoliths is an incubator for developers, artists, creators, and entrepreneurs to build in Web3!" key="twdesc" />
        <meta name="twitter:image" content="https://fecoliths.com/images/main2.jpeg/" key="twimage" />
      </Head>


      <div >
          <div className="flex items-center justify-between w-full border-b-2	pb-6">
            <a href="/" className=""><img src="images/main2.jpeg" width="108" alt="" className="logo-image" /></a>
            <nav className="flex flex-wrap flex-row justify-around spacefont">
              <a href="/#about" className="text-4xl text-white hover:text-white m-6">About</a>
              <a href="/mint" className="text-4xl text-white hover:text-white m-6">Mint!</a>
              <a href="/#team" className="text-4xl text-white hover:text-white m-6">Team</a>
              <a href="/#contact" className="text-4xl text-white hover:text-white m-6">Contact</a>
              <a href="https://twitter.com/Fecoliths" className="text-4xl  hover:text-bkack m-6 text-white">TWITTER</a>
              <a href="https://discord.gg/qzEhTc5T86" className="text-4xl  hover:text-bkack m-6 text-white">DISCORD</a>
              <a href="https://marketplace-ruby.vercel.app" className="text-4xl  hover:text-bkack m-6 text-white">MARKETPLACE</a>
              <a href="https://opensea.io/collection/fecoliths" className="text-4xl  hover:text-bkack m-6 text-white">OpenSea</a>
            </nav>
             
          </div>
          <div className="flex auth my-8 font-bold  justify-center items-center vw2">
            {!signedIn ? <button onClick={signIn} className="montserrat inline-block border-2 border-black bg-white border-opacity-100 no-underline hover:text-black py-2 px-4 mx-4 shadow-lg hover:bg-blue-500 hover:text-gray-100">Connect Wallet with Metamask</button>
            :
            <button onClick={signOut} className="montserrat inline-block border-2 border-black bg-white border-opacity-100 no-underline hover:text-black py-2 px-4 mx-4 shadow-lg hover:bg-blue-500 hover:text-gray-100">Wallet Connected: {walletAddress}</button>}
          </div>
        </div>

        <div className="md:w-2/3 w-4/5">
       
        
          <div className="mt-6 border-b-2 py-6">

            <div className="flex flex-col items-center">

                <span className="flex spacefont text-3xl text-white items-center bg-grey-lighter rounded rounded-r-none my-4 ">TOTAL FECOLITHS MINTED:   <span className="text-white text-3xl"> {!signedIn ?  <>-</>  :  <>{totalSupply}</> } / 5000</span></span>

                <div id="mint" className="flex justify-around  mt-8 mx-6">
                  <span className="flex montserrat text-4xl text-white items-center bg-grey-lighter rounded rounded-r-none px-3 font-bold">I WANT</span>
                  
                  <input 
                                      type="number" 
                                      min="1"
                                      max="20"
                                      value={how_many_fecoliths}
                                      onChange={ e => set_how_many_fecoliths(e.target.value) }
                                      name="" 
                                      className="montserrat pl-4 text-4xl  inline bg-grey-lighter  py-2 font-normal rounded text-grey-darkest  font-bold"
                                  />
                  
                  <span className="flex montserrat text-4xl text-white items-center bg-grey-lighter rounded rounded-r-none px-3 font-bold">FECOLITHS!</span>
    
                </div>
                {saleStarted ? 
                 <button onClick={() => mintFecolith(how_many_fecoliths)} className="mt-4 montserrat text-3xl border-6 bg-white  text-black hover:text-black p-2 ">MINT {how_many_fecoliths} Fecolith(s) for {(fecolithPrice * how_many_fecoliths) / (10 ** 18)} ETH + GAS</button>        
                  : <button className="mt-4 montserrat text-3xl border-6 bg-white  text-black hover:text-black p-2 ">SALE IS NOT ACTIVE OR NO WALLET IS CONNECTED</button>        
            
              }
                
             <p className="text-2xl text-center text-white my-6  montserrat">Max purchase of 20 Fecoliths per transaction
             </p>

              
            </div> 
            </div>
 
          </div>  
    </div>  
    )
  }
