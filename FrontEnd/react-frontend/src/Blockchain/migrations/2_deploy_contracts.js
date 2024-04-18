const MiContrato = artifacts.require("MiContrato");
const Ecommerce = artifacts.require("Ecommerce");

module.exports = function(deployer) {
  deployer.deploy(MiContrato);
  deployer.deploy(Ecommerce);
};