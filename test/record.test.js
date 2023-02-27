const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/RecordFactory.json");
const compiledRecord = require("../ethereum/build/healthrecord.json");

let accounts;
let factory;
let recordAddress;
let record;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createRecord()
    .send({ from: accounts[0], gas: "1000000" });

  [recordAddress] = await factory.methods.getDeployedRecords().call();

  record = await new web3.eth.Contract(
    JSON.parse(compiledRecord.interface),
    recordAddress
  );
});

describe("health records", () => {
  it("deploys a factory and record contract", () => {
    assert.ok(factory.options.address);
    assert.ok(record.options.address);
  });

  it("marks caller as a manager", async () => {
    const manager = await record.methods.manager().call();
    assert(accounts[0] == manager);
  });
});
