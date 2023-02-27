import RecordFactory from "./build/RecordFactory.json";
import web3 from "./web3";

const instance = new web3.eth.Contract(
  JSON.parse(RecordFactory.interface),
  "0xdc570d9c3551D0A4137dd1d7B356C38878323288"
);

export default instance;
