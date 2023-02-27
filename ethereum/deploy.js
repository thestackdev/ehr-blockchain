const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("../ethereum/build/RecordFactory.json");

const provider = new HDWalletProvider({
  mnemonic: {
    phrase:
      "march box art maid curtain empty above security wave adapt yellow scout",
  },
  providerOrUrl: "https://rinkeby.infura.io/v3/your-infura-project-id",
});

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("attempting to deploy from account", accounts[0]);
  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode, arguments: [] })
    .send({ from: accounts[0], gas: "5000000" });

  console.log("contract deployed to", result.options.address);
};

deploy();
