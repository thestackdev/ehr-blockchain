import { Router } from "../../routes";
import React, { Component } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import record from "../../ethereum/record";
import web3 from "../../ethereum/web3";

const ipfsClient = require("ipfs-http-client");

const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class addRecord extends Component {
  state = {
    account: "",
    reportBuffer: null,
    prescriptionBuffer: null,
    recordInstance: null,
    loading: false,
    message: "",
    errorMessage: "",
    visible: true,
  };
  static getInitialProps(props) {
    const address = props.query.address;
    const docaddress = props.query.docaddress;
    return { address, docaddress };
  }
  captureReport = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ reportBuffer: Buffer(reader.result) });
      console.log("buffer", this.state.reportBuffer);
    };
  };
  capturePrescription = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ prescriptionBuffer: Buffer(reader.result) });
      console.log("buffer", this.state.prescriptionBuffer);
    };
  };
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const recordInstance = record(this.props.address);
    this.setState({ account: accounts[0], recordInstance });
  }
  onSubmit = async (event) => {
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
      if (this.state.prescriptionBuffer != null)
        resultPrescription = await ipfs.add(this.state.prescriptionBuffer);
      if (this.state.reportBuffer != null)
        resultReport = await ipfs.add(this.state.reportBuffer);
      this.setState({ message: "added your files pushing to blockchain" });
      if (resultPrescription != null) {
        const link = "https://ipfs.infura.io/ipfs/" + resultPrescription.path;
        await this.state.recordInstance.methods
          .setPrescriptionHash(this.state.account, link)
          .send({ from: this.state.account });
      }
      if (resultReport != null) {
        const link = "https://ipfs.infura.io/ipfs/" + resultReport.path;
        await this.state.recordInstance.methods
          .setreportHash(this.state.account, link)
          .send({ from: this.state.account });
      }
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false, message: "succefully done Thank you!!" });
    Router.pushRoute(`/Records/${this.props.address}`);
  };
  render() {
    return (
      <Layout>
        <h3>add files</h3>
        <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit}>
          <Form.Input
            type="file"
            label="prescription(if any)"
            onChange={this.capturePrescription}
          />
          <Form.Input
            type="file"
            label="report(if any)"
            onChange={this.captureReport}
          />
          <Button primary loading={this.state.loading}>
            Submit
          </Button>
          <Message error header="Oops!!" content={this.state.errorMessage} />
          <Message
            info
            header=":)"
            content={this.state.message}
            hidden={this.state.visible}
          />
        </Form>
      </Layout>
    );
  }
}

export default addRecord;
