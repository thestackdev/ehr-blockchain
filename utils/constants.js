import healthRecordJSON from "./healthrecord.json";
import recordFactoryJSON from "./RecordFactory.json";

export const recordFactoryAddress =
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const recordFactoryABI = recordFactoryJSON.abi;

export const healthRecordABI = healthRecordJSON.abi;

export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY;
export const IPFS_BASE = process.env.NEXT_PUBLIC_IPFS_API;
export const IPFS_PORT = process.env.NEXT_PUBLIC_IPFS_PORT;
export const IPFS_PROTOCOL = process.env.NEXT_PUBLIC_IPFS_PROTOCOL;

