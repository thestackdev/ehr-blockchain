const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildpath = path.resolve(__dirname, "build");
fs.removeSync(buildpath);

const contractpath = path.resolve(__dirname, "contracts", "healthrecord.sol");
const source = fs.readFileSync(contractpath, "utf8");
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildpath);
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildpath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
