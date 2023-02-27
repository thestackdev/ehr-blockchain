import React, { Component } from "react";
import { Button, Form, Icon, Message } from "semantic-ui-react";
import Layout from "../components/Layout";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
const ipfsClient = require("ipfs-http-client");

const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class newDoc extends Component {
  state = {
    name: "",
    address: "",
    speciality: "",
    buffer: null,
    loading: false,
    errorMessage: "",
    account: "",
    manageraddress: "",
  };
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const manageraddress = await factory.methods.manager().call();
    this.setState({ account: accounts[0], manageraddress });
  }
  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };
  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    try {
      const result = await ipfs.add(this.state.buffer);
      const accounts = await web3.eth.getAccounts();
      const imagelink = "https://ipfs.infura.io/ipfs/" + result.path;
      await factory.methods
        .registerDoctor(
          this.state.address,
          imagelink,
          this.state.speciality,
          this.state.name
        )
        .send({ from: accounts[0] });
    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(err);
    }
    this.setState({ loading: false });
    Router.pushRoute("/doctors");
  };
  render() {
    if (this.state.account != this.state.manageraddress) {
      return (
        <Layout>
          <h1>Sorry this page can only be accesed by the manager</h1>
        </Layout>
      );
    }
    return (
      <Layout>
        <h1>Register Doctor</h1>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="name"
              placeholder="name"
              onChange={(event) => {
                this.setState({ name: event.target.value });
              }}
              required
            />
            <Form.Input
              fluid
              label="address"
              placeholder="address"
              onChange={(event) => {
                this.setState({ address: event.target.value });
              }}
              required
            />
          </Form.Group>

          <Form.TextArea
            label="description about speciality"
            placeholder="Type here"
            onChange={(event) => {
              this.setState({ speciality: event.target.value });
            }}
            required
          />
          <Form.Input
            type="file"
            label="image"
            onChange={this.captureFile}
            required
            accept="image/png,image/jpeg"
          />
          <Button primary type="submit" loading={this.state.loading}>
            <Icon name="add circle" />
            Register
          </Button>
          <Message error header="Oops!!" content={this.state.errorMessage} />
        </Form>
      </Layout>
    );
  }
}

export default newDoc;
