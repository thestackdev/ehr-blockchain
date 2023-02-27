import Web3 from "web3";
let web3;
let provider;
const enable = async () => {
  await window.ethereum.enable();
};
if (typeof window !== "undefined") {
  if (typeof window.web3 !== "undefined") {
    provider = window.web3.currentProvider;
    enable();
  }
} else {
  provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
}
web3 = new Web3(provider);
export default web3;
