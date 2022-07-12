require(`@nomiclabs/hardhat-waffle`);

module.exports = {
  solidity:'0.8.0',
  networks: {
    rinkeby : {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/VjEIxntqU8I66zRzkCNRrQzVk-RKj4Rd',
      accounts: [ '1fcf782a270ac13149f27d6be1a4e5dd70b5462b9db1fd60d9a82c760cf80704' ]
    }
  }
}