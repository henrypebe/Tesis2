const { Web3 } = require('web3');
const web3 = new Web3("http://127.0.0.1:7545");
const abi = require("./build/contracts/Ecommerce.json").abi;
const address = require("./build/contracts/Ecommerce.json").networks["5777"].address;
const ecommerceContract = new web3.eth.Contract(abi, address);

async function createAndVerifyTransaction() {
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const transactionReceipt = await ecommerceContract.methods.createTransaction(
            "John Doe",
            Math.floor(Date.now() / 1000) + 3600, // Fecha de entrega 1 hora después de ahora
            Math.floor(Date.now() / 1000),
            100,
            10,
            false,
            1,
            "Credit Card",
            5,
            "123 Main St, Anytown"
        ).send({ from: account, gas: 5000000 });

        // const transactionId = transactionReceipt.events.TransactionCreated.returnValues.transactionId;

        // const transactionDetails = await ecommerceContract.methods.getTransaction(transactionId).call();
        // console.log("Transacción almacenada correctamente:");
        // console.log(transactionDetails);
        // const deliveryDate = new Date(1713419579 * 1000); // Multiplica por 1000 porque JavaScript maneja milisegundos
        // const creationDate = new Date(1713415979 * 1000);

        // console.log("Fecha de entrega:", deliveryDate);
        // console.log("Fecha de creación:", creationDate);
    } catch (error) {
        console.error("Error al almacenar la transacción:", error);
    }
}

async function getAllTransactions() {
    try {
        // Obtiene el número total de transacciones almacenadas en el contrato
        const totalTransactions = await ecommerceContract.methods.transactionCount().call();
        console.log("Número total de transacciones:", totalTransactions);

        // Obtiene todos los detalles de todas las transacciones
        const allTransactions = [];
        for (let i = 0; i < totalTransactions; i++) {
            const transaction = await ecommerceContract.methods.getTransaction(i).call();
            allTransactions.push(transaction);
        }

        console.log("Detalles de todas las transacciones:", allTransactions);
    } catch (error) {
        console.error("Error al obtener las transacciones:", error);
    }
}

async function getAllProducts() {
    try {
        // Obtiene el número total de productos almacenadas en el contrato
        const totalProducts = await ecommerceContract.methods.transactionProductCount().call();
        console.log("Número total de productos:", totalProducts);

        // Obtiene todos los detalles de todas las productos
        const allProducts = [];
        for (let i = 0; i < totalProducts; i++) {
            const products = await ecommerceContract.methods.getProductTransaction(i).call();
            allProducts.push(products);
        }

        console.log("Detalles de todas las productos:", allProducts);
    } catch (error) {
        console.error("Error al obtener las productos:", error);
    }
}

async function getProductsByTransaction(transactionId) {
    try {
        const result = await ecommerceContract.methods.getProductsByTransaction(transactionId).call();
        console.log("Matching Product IDs:", result[0]);
        console.log("Matching Names:", result[1]);
        console.log("Matching Prices:", result[2]);
    } catch (error) {
        console.error('Error fetching products by transaction:', error);
    }
}

// createAndVerifyTransaction();

// getAllTransactions();
getAllProducts();


// getProductsByTransaction("0x7777081249eff865e7e8056e409a17886a87cadca370f74e99ddeb48c7e8671a");
