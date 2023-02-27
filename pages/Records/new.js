import React, { Component, createFactory } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

import { Router } from "../../routes";

//ipfs requirements
const ipfsClient = require("ipfs-http-client");

const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
const options = [
  { key: "m", text: "Male", value: "male" },
  { key: "f", text: "Female", value: "female" },
  { key: "o", text: "Other", value: "other" },
];
class newRecord extends Component {
  state = {
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
    imageHash: "",
    doctorAddress: this.props.doctor,
    message: "",
    visible: true,
  };

  static getInitialProps(props) {
    return { doctor: props.query.address };
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
  }

  captureFilePrescription = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ bufferPrescription: Buffer(reader.result) });
      console.log("bufferPrescription", this.state.bufferPrescription);
    };
  };

  captureFileReport = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ bufferReport: Buffer(reader.result) });
      console.log("bufferReport", this.state.bufferReport);
    };
  };

  captureFileImage = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ imageHash: Buffer(reader.result) });
      console.log("imageHash", this.state.imageHash);
    };
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const { name, age, gender, height, weight, doctorAddress } = this.state;
    this.setState({
      loading: true,
      visible: false,
      message: "your files are being uploaded to ipfs",
      errorMessage: "",
    });
    try {
      let resultPrescriptionLink = "";
      if (this.state.bufferPrescription != null) {
        const resultPrescription = await ipfs.add(
          this.state.bufferPrescription
        );
        resultPrescriptionLink =
          "https://ipfs.infura.io/ipfs/" + resultPrescription.path;
      }
      let resultReportLink = "";
      if (this.state.bufferReport != null) {
        const resultReport = await ipfs.add(this.state.bufferReport);
        resultReportLink = "https://ipfs.infura.io/ipfs/" + resultReport.path;
      }
      const imageHash = await ipfs.add(this.state.imageHash);
      this.setState({ message: "added your files, creating your record" });
      await factory.methods
        .createRecord(
          name,
          age,
          gender,
          height,
          weight,
          doctorAddress,
          resultPrescriptionLink,
          resultReportLink,
          "https://ipfs.infura.io/ipfs/" + imageHash.path
        )
        .send({ from: this.state.account });
      Router.pushRoute("/all");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Group widths="equal">
            <Form.Input
              label="name"
              placeholder="name"
              onChange={(event, { value }) => {
                this.setState({ name: value });
              }}
              required
            />
            <Form.Input
              label="age"
              placeholder="age"
              onChange={(e, { value }) => {
                this.setState({ age: value });
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
                this.setState({ gender: value });
              }}
              required
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="height"
              placeholder="height(cm)"
              onChange={(event, { value }) => {
                this.setState({ height: value });
              }}
              required
              min="0"
              max="200"
            />
            <Form.Input
              label="weight"
              placeholder="weight(kg)"
              onChange={(e, { value }) => {
                this.setState({ weight: value });
              }}
              required
            />
            <Form.Input
              label="Profile Image"
              type="file"
              onChange={this.captureFileImage}
              required
              accept="image/png,image/jpeg"
            />
          </Form.Group>
          <Form.Field>
            <label>prescriptions(if any previous prescriptions)</label>
            <Form.Input type="file" onChange={this.captureFilePrescription} />
          </Form.Field>
          <Form.Field>
            <label>reports(if any previous reports)</label>
            <Form.Input type="file" onChange={this.captureFileReport} />
          </Form.Field>
          <Message error header="Oops!!" content={this.state.errorMessage} />
          <Message
            info
            header="Please wait It may take two minutes!!"
            content={this.state.message}
            hidden={this.state.visible}
          />
          <Button loading={this.state.loading} primary type="submit">
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default newRecord;
