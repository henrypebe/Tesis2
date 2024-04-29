// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ecommerce {
    
    struct Product {
        string idTransaction;
        uint idProduct;
        string Name;
        uint Price;
        uint Count;
        string NameShop;
        uint Discount;
    }
    
    struct Transaction {
        string customerName;
        uint deliveryDate;
        uint creationDate;
        uint total;
        uint totalDiscount;
        uint productCount;
        string paymentMethod;
        uint shippingCost;
        string deliveryAddress;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => Product) public products;
    uint public transactionCount;
    uint public transactionProductCount;

    event TransactionCreated(uint indexed transactionId);

    function createTransaction(
        string memory _customerName,
        uint _deliveryDate,
        uint _creationDate,
        uint _total,
        uint _totalDiscount,
        uint _productCount,
        string memory _paymentMethod,
        uint _shippingCost,
        string memory _deliveryAddress
    ) public {
        transactions[transactionCount] = Transaction({
            customerName: _customerName,
            deliveryDate: _deliveryDate,
            creationDate: _creationDate,
            total: _total,
            totalDiscount: _totalDiscount,
            productCount: _productCount,
            paymentMethod: _paymentMethod,
            shippingCost: _shippingCost,
            deliveryAddress: _deliveryAddress
        });
        emit TransactionCreated(transactionCount);
        transactionCount++;
    }

    function createProductTransaction(
        string memory _idTransaction,
        uint _idProduct,
        string memory _nameProduct,
        uint _priceProduct,
        uint _count,
        string memory _nameShop,
        uint _discount
    ) public {
        products[transactionProductCount] = Product({
            idTransaction: _idTransaction,
            idProduct: _idProduct,
            Name: _nameProduct,
            Price: _priceProduct,
            Count: _count,
            NameShop: _nameShop,
            Discount: _discount
        });
        emit TransactionCreated(transactionProductCount);
        transactionProductCount++;
    }

    function getTransaction(uint _transactionId) public view returns (
        string memory customerName,
        uint deliveryDate,
        uint creationDate,
        uint total,
        uint totalDiscount,
        uint productCount,
        string memory paymentMethod,
        uint shippingCost,
        string memory deliveryAddress
    ) {
        Transaction storage transaction = transactions[_transactionId];
        return (
            transaction.customerName,
            transaction.deliveryDate,
            transaction.creationDate,
            transaction.total,
            transaction.totalDiscount,
            transaction.productCount,
            transaction.paymentMethod,
            transaction.shippingCost,
            transaction.deliveryAddress
        );
    }

    function getProductTransaction(uint _transactionProductId) public view returns (
        string memory idTransaction,
        uint idProduct,
        string memory Name,
        uint Price,
        uint count,
        string memory NameShop,
        uint discount
    ) {
        Product storage product = products[_transactionProductId];
        return (
            product.idTransaction,
            product.idProduct,
            product.Name,
            product.Price,
            product.Count,
            product.NameShop,
            product.Discount
        );
    }

    function getProductsByTransaction(string memory _idTransaction) public view returns (
        uint[] memory matchingProductIds,
        string[] memory matchingNames,
        uint[] memory matchingPrices
    ) {
        uint count = 0;
        uint totalProducts = transactionProductCount;

        // Recorremos todos los productos para encontrar aquellos que coincidan con el idTransaction
        for (uint i = 0; i < totalProducts; i++) {
            if (keccak256(abi.encodePacked(products[i].idTransaction)) == keccak256(abi.encodePacked(_idTransaction))) {
                count++;
            }
        }

        // Creamos arrays con longitud igual a la cantidad de productos que coinciden
        matchingProductIds = new uint[](count);
        matchingNames = new string[](count);
        matchingPrices = new uint[](count);

        uint index = 0;

        // Recorremos nuevamente todos los productos para almacenar los que coinciden
        for (uint j = 0; j < totalProducts; j++) {
            if (keccak256(abi.encodePacked(products[j].idTransaction)) == keccak256(abi.encodePacked(_idTransaction))) {
                matchingProductIds[index] = products[j].idProduct;
                matchingNames[index] = products[j].Name;
                matchingPrices[index] = products[j].Price;
                index++;
            }
        }

        return (matchingProductIds, matchingNames, matchingPrices);
    }

    function getAllTransactions() public view returns (Transaction[] memory) {
        Transaction[] memory allTransactions = new Transaction[](transactionCount);
        for (uint i = 0; i < transactionCount; i++) {
            allTransactions[i] = transactions[i];
        }
        return allTransactions;
    }
}