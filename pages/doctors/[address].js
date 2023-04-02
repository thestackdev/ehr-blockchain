import { create } from "ipfs-http-client";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { TransactionContext } from "../../context/Entherum";
import {
  IPFS_BASE,
  IPFS_GATEWAY,
  IPFS_PORT,
  IPFS_PROTOCOL,
} from "../../utils/constants";

const ipfs = create({
  host: IPFS_BASE,
  port: IPFS_PORT,
  protocol: IPFS_PROTOCOL,
});

const options = [
  { key: "m", text: "Male", value: "male" },
  { key: "f", text: "Female", value: "female" },
  { key: "o", text: "Other", value: "other" },
];

export default function CreateRecord() {
  const { createRecord } = useContext(TransactionContext);
  const router = useRouter();
  const [state, setState] = useState({
    name: "",
    bufferReport: null,
    bufferPrescription: null,
    account: null,
    errorMessage: "",
    loading: false,
    age: "",
    gender: "",
    height: "",
    weight: "",
    imageHash: null,
    doctorAddress: router.query.address,
    message: "",
    visible: true,
  });

  const captureFilePrescription = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setState((e) => ({ ...e, bufferPrescription: Buffer(reader.result) }));
      console.log("bufferPrescription", state.bufferPrescription);
    };
  };

  const captureFileReport = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setState((e) => ({ ...e, bufferReport: Buffer(reader.result) }));
      console.log("bufferReport", state.bufferReport);
    };
  };

  const captureFileImage = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setState((e) => ({ ...e, imageHash: Buffer(reader.result) }));
      console.log("imageHash", state.imageHash);
    };
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { name, age, gender, height, weight, doctorAddress } = state;
    setState((e) => ({
      ...e,
      loading: true,
      visible: false,
      message: "your files are being uploaded to ipfs",
      errorMessage: "",
    }));

    try {
      let resultPrescriptionLink = "";
      if (state.bufferPrescription != null) {
        const resultPrescription = await ipfs.add(state.bufferPrescription);
        resultPrescriptionLink = IPFS_GATEWAY + resultPrescription.path;
      }
      let resultReportLink = "";
      if (state.bufferReport != null) {
        const resultReport = await ipfs.add(state.bufferReport);
        resultReportLink = IPFS_GATEWAY + resultReport.path;
      }
      const imageHash = await ipfs.add(state.imageHash);
      setState((e) => ({
        ...e,
        message: "added your files, creating your record",
      }));

      await createRecord({
        name,
        age,
        gender,
        height,
        weight,
        doctorAddress,
        resultPrescriptionLink,
        resultReportLink,
        imageLink: IPFS_GATEWAY + imageHash.path,
      });
      router.push("/all");
    } catch (err) {
      setState((e) => ({ ...e, errorMessage: err.message }));
    }
    setState((e) => ({ ...e, loading: false }));
  };

  return (
    <Layout>
      <Form onSubmit={onSubmit} error={!!state.errorMessage}>
        <Form.Group widths="equal">
          <Form.Input
            label="name"
            placeholder="name"
            onChange={(event, { value }) => {
              setState((e) => ({ ...e, name: value }));
            }}
            required
          />
          <Form.Input
            label="age"
            placeholder="age"
            onChange={(e, { value }) => {
              setState((e) => ({ ...e, age: value }));
            }}
            required
            type="number"
            min="0"
            max="100"
          />
          <Form.Select
            label="gender"
            placeholder="gender"
            options={options}
            onChange={(event, { value }) => {
              setState((e) => ({ ...e, gender: value }));
            }}
            required
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            label="height"
            placeholder="height(cm)"
            onChange={(event, { value }) => {
              setState((e) => ({ ...e, height: value }));
            }}
            required
            min="0"
            max="200"
          />
          <Form.Input
            label="weight"
            placeholder="weight(kg)"
            onChange={(e, { value }) => {
              setState((e) => ({ ...e, weight: value }));
            }}
            required
          />
          <Form.Input
            label="Profile Image"
            type="file"
            onChange={captureFileImage}
            accept="image/png,image/jpeg"
          />
        </Form.Group>
        <Form.Field>
          <label>prescriptions(if any previous prescriptions)</label>
          <Form.Input type="file" onChange={captureFilePrescription} />
        </Form.Field>
        <Form.Field>
          <label>reports(if any previous reports)</label>
          <Form.Input type="file" onChange={captureFileReport} />
        </Form.Field>
        <Message error header="Oops!!" content={state.errorMessage} />
        <Message
          info
          header="Please wait It may take two minutes!!"
          content={state.message}
          hidden={state.visible}
        />
        <Button loading={state.loading} primary type="submit">
          Create
        </Button>
      </Form>
    </Layout>
  );
}
