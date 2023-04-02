import { create } from "ipfs-http-client";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { TransactionContext } from "../../../context/Entherum";
import {
  IPFS_BASE,
  IPFS_GATEWAY,
  IPFS_PORT,
  IPFS_PROTOCOL,
} from "../../../utils/constants";

const ipfs = create({
  host: IPFS_BASE,
  port: IPFS_PORT,
  protocol: IPFS_PROTOCOL,
});

export default function AddRecord() {
  const router = useRouter();
  const { setReportHash, setPrescriptionHash, getMyDoctors, getDoctor } =
    useContext(TransactionContext);

  const address = router.query.address;

  const [state, setState] = useState({
    account: "",
    reportBuffer: null,
    prescriptionBuffer: null,
    recordInstance: null,
    loading: false,
    message: "",
    errorMessage: "",
    visible: true,
    doctor: null,
  });
  const [options, setOptions] = useState([]);

  const captureReport = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setState((e) => ({ ...e, reportBuffer: Buffer(reader.result) }));
    };
  };

  const capturePrescription = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setState((e) => ({ ...e, prescriptionBuffer: Buffer(reader.result) }));
    };
  };

  const fetchDoctors = async () => {
    const doctorsHash = await getMyDoctors(router.query.address);
    const doctors = [];
    for (let i = 0; i < doctorsHash.length; i++) {
      const doctor = await getDoctor(doctorsHash[i]);
      doctors.push({
        key: doctor.doc,
        text: doctor.description,
        value: doctor.doc,
      });
    }
    setOptions(doctors);
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
      setState((e) => ({
        ...e,
        message: "added your files pushing to blockchain",
      }));
      if (resultPrescription != null) {
        const link = IPFS_GATEWAY + resultPrescription.path;
        await setPrescriptionHash(address, link);
      }
      if (resultReport != null) {
        const link = IPFS_GATEWAY + resultReport.path;
        await setReportHash(address, link);
      }
    } catch (error) {
      setState((e) => ({ ...e, errorMessage: error.message }));
    }
    setState((e) => ({
      ...e,
      loading: false,
      message: "succefully done Thank you!!",
    }));
    router.push(`/records/${router.query.address}`);
  };

  useEffect(() => {
    if (!address) return;
    fetchDoctors();
  }, [router.isReady]);

  return (
    <Layout>
      <h1 className="font-bold text-2xl mb-6">Add files</h1>
      <Form error={!!state.errorMessage} onSubmit={onSubmit}>
        {/* <Form.Select
          label="Doctor"
          placeholder="Doctor"
          required
          options={options}
          onChange={(event, { value }) => {
            setState((e) => ({ ...e, doctor: value }));
          }}
        /> */}
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
