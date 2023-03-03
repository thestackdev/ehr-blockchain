import { create } from "ipfs-http-client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default function AddRecord(props) {
  const address = props.query.address;
  const docaddress = props.query.docaddress;
  const router = useRouter();

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

  useEffect(() => {
    fetchRecords();
  }, []);

  const captureReport = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ reportBuffer: Buffer(reader.result) });
      console.log("buffer", state.reportBuffer);
    };
  };

  const capturePrescription = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ prescriptionBuffer: Buffer(reader.result) });
      console.log("buffer", state.prescriptionBuffer);
    };
  };

  const fetchRecords = async () => {
    // const accounts = await web3.eth.getAccounts();
    // const recordInstance = record(props.address);
    // this.setState({ account: accounts[0], recordInstance });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
      message: "Your files are being added to ipfs",
      errorMessage: "",
      visible: false,
    });
    try {
      let resultPrescription = null;
      let resultReport = null;
      if (state.prescriptionBuffer != null)
        resultPrescription = await ipfs.add(state.prescriptionBuffer);
      if (state.reportBuffer != null)
        resultReport = await ipfs.add(state.reportBuffer);
      this.setState({ message: "added your files pushing to blockchain" });
      if (resultPrescription != null) {
        const link = "https://ipfs.infura.io/ipfs/" + resultPrescription.path;
        await this.state.recordInstance.methods
          .setPrescriptionHash(state.account, link)
          .send({ from: state.account });
      }
      if (resultReport != null) {
        const link = "https://ipfs.infura.io/ipfs/" + resultReport.path;
        await this.state.recordInstance.methods
          .setreportHash(state.account, link)
          .send({ from: state.account });
      }
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false, message: "succefully done Thank you!!" });
    router.push(`/Records/${props.address}`);
  };

  return (
    <Layout>
      <h3>add files</h3>
      <Form error={!!this.state.errorMessage} onSubmit={onSubmit}>
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
