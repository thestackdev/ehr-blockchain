import { create } from "ipfs-http-client";
import { useRouter } from "next/router";
import React, { useEffect, useState, useContext } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { TransactionContext } from "../../../context/Entherum";
import { IPFS_BASE, IPFS_GATEWAY, IPFS_PORT, IPFS_PROTOCOL } from "../../../utils/constants";

const ipfs = create({
  host: IPFS_BASE,
  port: IPFS_PORT,
  protocol: IPFS_PROTOCOL,
});

export default function AddRecord() {
  const router = useRouter();
  const {
    setReportHash,
    setPrescriptionHash, currentAccount
  } = useContext(TransactionContext);

  const [state, setState] = useState({
    account: "",
    reportBuffer: null,
    prescriptionBuffer: null,
    recordInstance: null,
    loading: false,
    message: "",
    errorMessage: "",
    visible: true,
  });

  const captureReport = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setState((e) => ({ ...e, reportBuffer: Buffer(reader.result) }));
      console.log("buffer", state.reportBuffer);
    };
  };

  const capturePrescription = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setState((e) => ({ ...e, prescriptionBuffer: Buffer(reader.result) }));
      console.log("buffer", state.prescriptionBuffer);
    };
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setState((e) => ({
      ...e,
      loading: true,
      message: "Your files are being added to ipfs",
      errorMessage: "",
      visible: false,
    }));
    try {
      let resultPrescription = null;
      let resultReport = null;
      if (state.prescriptionBuffer != null)
        resultPrescription = await ipfs.add(state.prescriptionBuffer);
      if (state.reportBuffer != null)
        resultReport = await ipfs.add(state.reportBuffer);
      setState((e) => ({ ...e, message: "added your files pushing to blockchain" }));
      if (resultPrescription != null) {
        const link = IPFS_GATEWAY + resultPrescription.path;
        await setPrescriptionHash(router.query.address, link)
      }
      if (resultReport != null) {
        const link = IPFS_GATEWAY + resultReport.path;
        await
          setReportHash(router.query.address, link)
      }
    } catch (error) {
      setState((e) => ({ ...e, errorMessage: error.message }));
    }
    setState((e) => ({ ...e, loading: false, message: "succefully done Thank you!!" }));
    router.push(`/records/${router.query.address}`);
  };

  return (
    <Layout>
      <h3>add files</h3>
      <Form error={!!state.errorMessage} onSubmit={onSubmit}>
        <Form.Input
          type="file"
          label="prescription(if any)"
          onChange={capturePrescription}
        />
        <Form.Input
          type="file"
          label="report(if any)"
          onChange={captureReport}
        />
        <Button primary loading={state.loading}>
          Submit
        </Button>
        <Message error header="Oops!!" content={state.errorMessage} />
        <Message
          info
          header=":)"
          content={state.message}
          hidden={state.visible}
        />
      </Form>
    </Layout>
  );
}

