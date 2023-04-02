import healthRecordJSON from "../artifacts/contracts/healthrecord.sol/healthrecord.json";
import recordFactoryJSON from "../artifacts/contracts/healthrecord.sol/RecordFactory.json";

export const recordFactoryAddress =
  "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";

export const recordFactoryABI = recordFactoryJSON.abi;

export const healthRecordABI = healthRecordJSON.abi;

export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY;
export const IPFS_BASE = process.env.NEXT_PUBLIC_IPFS_API;
export const IPFS_PORT = process.env.NEXT_PUBLIC_IPFS_PORT;
export const IPFS_PROTOCOL = process.env.NEXT_PUBLIC_IPFS_PROTOCOL;
