import compiledRecord from "./build/healthrecord.json";
import web3 from "./web3";

export default function Record(address) {
  return new web3.eth.Contract(JSON.parse(compiledRecord.interface), address);
}
