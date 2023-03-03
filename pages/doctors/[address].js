import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { TransactionContext } from "../../context/Entherum";

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
    bufferReport:
      "https://w7.pngwing.com/pngs/415/182/png-transparent-national-health-service-general-practitioner-physician-junior-doctor-patient-doctor-female-doctor-illustration-service-people-dentistry.png",
    bufferPrescription:
      "https://w7.pngwing.com/pngs/415/182/png-transparent-national-health-service-general-practitioner-physician-junior-doctor-patient-doctor-female-doctor-illustration-service-people-dentistry.png",
    account: null,
    errorMessage: "",
    loading: false,
    age: "",
    gender: "",
    height: "",
    weight: "",
    imageHash:
      "https://w7.pngwing.com/pngs/415/182/png-transparent-national-health-service-general-practitioner-physician-junior-doctor-patient-doctor-female-doctor-illustration-service-people-dentistry.png",
    doctorAddress: router.query.address,
    message: "",
    visible: true,
  });

  const captureFilePrescription = (event) => {
    // event.preventDefault();
    // const file = event.target.files[0];
    // const reader = new window.FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onloadend = () => {
    //   this.setState({ bufferPrescription: Buffer(reader.result) });
    //   console.log("bufferPrescription", this.state.bufferPrescription);
    // };
  };

  const captureFileReport = (event) => {
    // event.preventDefault();
    // const file = event.target.files[0];
    // const reader = new window.FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onloadend = () => {
    //   this.setState({ bufferReport: Buffer(reader.result) });
    //   console.log("bufferReport", this.state.bufferReport);
    // };
  };

  const captureFileImage = (event) => {
    // event.preventDefault();
    // const file = event.target.files[0];
    // const reader = new window.FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onloadend = () => {
    //   this.setState({ imageHash: Buffer(reader.result) });
    //   console.log("imageHash", this.state.imageHash);
    // };
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
      // if (state.bufferPrescription != null) {
      //   const resultPrescription = await ipfs.add(
      //     state.bufferPrescription
      //   );
      //   resultPrescriptionLink =
      //     "https://ipfs.infura.io/ipfs/" + resultPrescription.path;
      // }
      let resultReportLink = "";
      // if (state.bufferReport != null) {
      //   const resultReport = await ipfs.add(state.bufferReport);
      //   resultReportLink = "https://ipfs.infura.io/ipfs/" + resultReport.path;
      // }
      // const imageHash = await ipfs.add(state.imageHash);
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
        imageLink: "https://ipfs.infura.io/ipfs/",
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
