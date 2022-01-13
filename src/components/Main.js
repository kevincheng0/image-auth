import React, { Component } from 'react';

class Main extends Component {
  

    render() {
        return (
            <div>
                <h1>Add Image</h1> 
                <form onSubmit={(event) => {
                    event.preventDefault()
                    const name = this.productName.value
                    const price = this.props.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
                    this.props.createProduct(name, price)
                }}>
                    <div className="form-group mr-sm-2">
                    <input
                        id="productName"
                        type="text"
                        ref={(input) => { this.productName = input }}
                        className="form-control"
                        placeholder="Product Name"
                        required />
                    </div>
                    <div className="form-group mr-sm-2">
                    <input
                        id="productPrice"
                        type="text"
                        ref={(input) => { this.productPrice = input }}
                        className="form-control"
                        placeholder="Product Price"
                        required />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Product</button>
                </form>
                <p>&nbsp;</p>
                <h2>Buy Product</h2>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Owner</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody id="productList">
                        { this.props.products.map((listing, idx) => {
                            return (
                                <tr key={idx}>
                                    <th scope="row">{ listing.id.toString() }</th>
                                    <td>{ listing.name.toString() }</td>
                                    <td>{ this.props.web3.utils.fromWei(listing.price.toString(), 'Ether') } Eth</td>
                                    <td>{ listing.owner.toString() }</td>
                                    <td>
                                        { !listing.purchased
                                        ? <button 
                                            name = { listing.id }
                                            value = { listing.price }
                                            onClick={ (event) => {
                                                this.props.purchaseProduct(event.target.name, event.target.value)
                                            }}
                                            >
                                            Buy
                                            </button>
                                        : null
                                        }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Main;
