import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import {
  healthRecordABI,
  recordFactoryABI,
  recordFactoryAddress,
} from "../utils/constants";

export const TransactionContext = React.createContext();

let ethereum;
if (typeof window !== "undefined") {
  ethereum = window.ethereum;
}

const createRecordFactoryContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const recordFactoryContract = new ethers.Contract(
    recordFactoryAddress,
    recordFactoryABI,
    signer
  );

  return recordFactoryContract;
};

const createHealthRecordContract = (address) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const healthRecordsContract = new ethers.Contract(
    address,
    healthRecordABI,
    signer
  );

  return healthRecordsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [manager, setManager] = useState("");

  const getAllRecords = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createRecordFactoryContract();
        const deployedRecords = await transactionsContract.getDeployedRecords();
        return deployedRecords;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctor = async (key) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const transactionsContract = createRecordFactoryContract();
        const doctor = await transactionsContract.docs(key);
        return doctor;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getManager = async () => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const transactionsContract = createRecordFactoryContract();
        const manager = await transactionsContract.manager();
        setManager(manager);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getDoctors = async () => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const recordFactoryContract = createRecordFactoryContract();
        const doctors = await recordFactoryContract.getDoctors();
        return doctors;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getMyDoctors = async (address) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const healthRecordContract = createHealthRecordContract(address);
        const doctors = await healthRecordContract.getMyDoctors();
        return doctors;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const addToMyDoctors = async (address, doctor) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const healthRecordContract = createHealthRecordContract(address);
        const doctors = await healthRecordContract.addToMyDoctors(doctor);
        return doctors;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getNameAndAddress = async (address) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const healthRecordContract = createHealthRecordContract(address);
        const details = await healthRecordContract.getNameandAddress();
        return details;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getDetails = async (address) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const healthRecordContract = createHealthRecordContract(address);
        const details = await healthRecordContract.getDetails();
        return details;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getPrescriptionLength = async (address) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const healthRecordContract = createHealthRecordContract(address);
        const details = await healthRecordContract.getPrescriptionLength();
        return details;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getReportLength = async (address) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const healthRecordContract = createHealthRecordContract(address);
        const details = await healthRecordContract.getReportLength();
        return details;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getPrescription = async (address, index) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const healthRecordContract = createHealthRecordContract(address);
        const details = await healthRecordContract.getPrescription(index);
        return details;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getReport = async (address, index) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const healthRecordContract = createHealthRecordContract(address);
        const details = await healthRecordContract.getReport(index);
        return details;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const setPrescriptionHash = async (address, hash) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const healthRecordContract = createHealthRecordContract(address);
        const details = await healthRecordContract.setPrescriptionHash(
          currentAccount,
          hash
        );
        await details.wait();
        return details;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const setReportHash = async (address, hash) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const healthRecordContract = createHealthRecordContract(address);
        const details = await healthRecordContract.setreportHash(
          currentAccount,
          hash
        );
        return details;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const createRecord = async (data) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const transactionsContract = createRecordFactoryContract();
        const doctor = await transactionsContract.createRecord(
          data.name,
          data.age,
          data.gender,
          data.height,
          data.weight,
          data.doctorAddress,
          data.resultPrescriptionLink,
          data.resultReportLink,
          data.imageLink
        );

        return doctor;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const registerDoctor = async (data) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const transactionsContract = createRecordFactoryContract();
        const doctor = await transactionsContract.registerDoctor(
          data.address,
          data.imagelink,
          data.speciality,
          data.name
        );
        await doctor.wait();
        return doctor;
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const checkIfWalletIsConnect = async () => {
    setIsLoading(true);
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        connectWallet();
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    getManager();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        isLoading,
        getDoctors,
        registerDoctor,
        getDoctor,
        manager,
        createRecord,
        getAllRecords,
        getNameAndAddress,
        getDetails,
        getPrescriptionLength,
        getReportLength,
        getPrescription,
        getReport,
        setReportHash,
        setPrescriptionHash,
        getMyDoctors,
        addToMyDoctors,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
