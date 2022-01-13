pragma solidity ^0.5.0;

contract Marketplace {
    string public name;  // state variable, stored in blockchain
    uint public productCount = 0;
    mapping(uint => Product) public products;  // hash table with id as key and Product struct as item
                                               // can't know how many items are in the mapping, so need counter cache
                                               // items in mapping are added to the blockchain
    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;  // address of the account 
        bool purchased;
    }

    event ProductCreated (
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased (
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor () public {
        name = "Image Auth";
    }

    function createProduct(string memory _name, uint _price) public {
        // verify parameters, stop execution to save gas
        require(bytes(_name).length > 0);
        require(_price > 0);

        // create the product
        productCount++;
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);  // msg is global variable in solidity. Find address of user

        // trigger event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
        // ensure product is able to be purchased
        require(_id > 0 && _id <= productCount);

        // fetch product
        Product memory _product = products[_id];  // copy an new version into memory
        address payable _seller = _product.owner;
        
        // ensure product is able to be purchased
        require(msg.value >= _product.price);
        require(!_product.purchased);
        require(_seller != msg.sender);

        // transfer ownership
        _product.owner = msg.sender;
        _product.purchased = true;
        products[_id] = _product;

        // pay seller
        address(_seller).transfer(msg.value);  // buyer sends amount of wei, stored in msg.value, and transfers to seller
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);

    }
}