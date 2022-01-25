import React, { Component } from 'react';
import Web3 from 'web3';

import { Route, Routes } from "react-router-dom";

import './App.css';
import Marketplace from '../abis/Marketplace.json';
import Navbar from './Navbar';
// import Main from './Main';
// import Loader from './Loader';
import ImageList from "./ImageList";
import Edit from "./edit";
import Create from "./create";

// Replace metamask later https://ethereum.stackexchange.com/questions/25839/how-to-make-transactions-using-private-key-in-web3
class App extends Component {
  static web3;

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
    this.createProduct = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    App.web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    await window.ethereum.enable();
  }

  async loadBlockchainData() {
    const web3 = App.web3;
    // Load Account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account : accounts[0]});

    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];

    if (networkData) {
      this.setState({ loading: true });

      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address);
      this.setState({ marketplace });
      const productCount = await marketplace.methods.productCount().call();

      // Load Products
      this.setState({ productCount: productCount });
      for (var i = 1; i <= productCount; ++i) {
        const product = await marketplace.methods.products(i).call();
        this.setState((state) => {
          return { products: [...state.products, product] };
        });
      }
      this.setState({ loading: false });
      console.log(this.state.products)
      
    } else {
      console.log("Contract not detected")
    }
  }

  createProduct(name, price) {
    console.log("creating product");
    this.setState({ loading: true });
    this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false });
    })
  }

  purchaseProduct(id, price) {
    console.log("buying product", id, price);
    this.setState({ loading: true });
    this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false });
    })
  }

  render() {
    return (
      <div>
        <Navbar account={ this.state.account }/>
        <Routes>
          <Route exact path="/" element={<ImageList />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/create" element={<Create />} />
        </Routes>
        {/* <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                { this.state.loading
                  ? <Loader/>
                  : <Main 
                    createProduct={ this.createProduct }
                    purchaseProduct={ this.purchaseProduct }
                    web3={ App.web3 }
                    products={ this.state.products }/> }
              </div>
            </main>
          </div>
        </div> */}
      </div>
    );
  }
}

export default App;
