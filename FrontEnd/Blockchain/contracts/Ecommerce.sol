// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ecommerce {
    struct Transaction {
        string customerName;
        uint deliveryDate;
        uint creationDate;
        uint total;
        uint totalDiscount;
        bool claim;
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
        bool _claim,
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
            claim: _claim,
            productCount: _productCount,
            paymentMethod: _paymentMethod,
            shippingCost: _shippingCost,
            deliveryAddress: _deliveryAddress
        });
        emit TransactionCreated(transactionCount);
        transactionCount++;
    }
}