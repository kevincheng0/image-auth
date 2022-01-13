const Marketplace = artifacts.require('./Marketplace.sol');
const chai = require('chai');
const BN = require('bn.js');
const assert = chai.assert;
chai.use(require('chai-as-promised')).should();
chai.use(require('chai-bn')(BN));


contract('Marketplace', function([deployer, seller, buyer]) {  // all accounts injected from ganache, an array
    let marketplace;

    before(async function() {
        marketplace = await Marketplace.deployed();
    })

    describe('deployment', function() {
        it('deploys successfully', async function() {
            const address = await marketplace.address;
            assert.notEqual(address, 0x0);
        });

        it('has name', async function() {
            assert.equal(await marketplace.name.call(), 'Marketplace');
        });

    });

    describe('product', function() {
        let product, productCount;

        // create the test product
        before(async function() {
            product = await marketplace.createProduct('Test Product', web3.utils.toWei('1', 'ether'), { from: seller });  // function metadata to set msg.sender
            productCount = await marketplace.productCount.call();
        });

        it('creates product', async function() {
            // CREATE SUCCESSFUL
            const event = product.logs[0].args;
            assert.equal(productCount, 1);
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.name, 'Test Product', 'name is correct');
            assert.equal(event.owner, seller, 'seller is correct');

            // CREATE FAILED
            await await marketplace.createProduct('', web3.utils.toWei('1', 'ether'), { from: seller }).should.be.rejected;
            await await marketplace.createProduct('Bob', 0, { from: seller }).should.be.rejected;
        });

        it('lists product', async function() {
            const result = await marketplace.products(productCount);
            assert.equal(result.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(result.name, 'Test Product', 'name is correct');
            assert.equal(result.owner, seller, 'seller is correct');
        });

        it('sells product', async function() {
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(seller);
            oldSellerBalance = new web3.utils.BN(oldSellerBalance);  // use new to make big number

            // PURCHASE SUCCESSFUL
            const result = await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'ether')})
            const event = result.logs[0].args;

            assert.equal(productCount, 1);
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.name, 'Test Product', 'name is correct');
            assert.equal(event.owner, buyer, 'seller is correct');
            assert.equal(event.purchased, true, 'seller is correct');

            // Check received funds
            let newSellerBalance;
            newSellerBalance = await web3.eth.getBalance(seller);
            newSellerBalance = new web3.utils.BN(newSellerBalance);

            let price;
            price = result.price;
            price = new web3.utils.BN(price);

            const expectedBalance = oldSellerBalance.add(price);
            oldSellerBalance.should.be.a.bignumber.that.equals(expectedBalance);

            // PURCHASE FAILED
            await await marketplace.purchaseProduct(2, { from: buyer, value: web3.utils.toWei('1', 'ether')}).should.be.rejected;
            await await marketplace.purchaseProduct(1, { from: buyer, value: web3.utils.toWei('0.4', 'ether')}).should.be.rejected;
            await await marketplace.purchaseProduct(1, { from: seller, value: web3.utils.toWei('1', 'ether')}).should.be.rejected;

        });

    });

    
});