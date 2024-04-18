// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MiContrato {
    // Esta variable será almacenada en la blockchain
    uint256 public miVariable;

    // Constructor del contrato que se ejecuta una vez en el momento del despliegue
    constructor() {
        // Inicializa la variable con un valor inicial de 100
        miVariable = 100;
    }

    // Función para actualizar el valor de miVariable
    function setVariable(uint256 _valor) public {
        miVariable = _valor;
    }
}