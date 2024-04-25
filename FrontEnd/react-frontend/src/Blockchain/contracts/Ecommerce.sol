// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ecommerce {
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
    uint public transactionCount;

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

    function getAllTransactions() public view returns (Transaction[] memory) {
        Transaction[] memory allTransactions = new Transaction[](transactionCount);
        for (uint i = 0; i < transactionCount; i++) {
            allTransactions[i] = transactions[i];
        }
        return allTransactions;
    }
}