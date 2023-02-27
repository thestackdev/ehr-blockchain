import React from "react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import web3 from "../ethereum/web3";
import { Component } from "react";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "../routes";

class doctor extends Component {
  state = {
    accounts: [],
    items: [],
  };
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const docs = await factory.methods.getDoctors().call({ from: accounts[0] });
    console.log(docs);
    const items = [];
    for (var i = 0; i < docs.length; i += 1) {
      const eachRecord = await factory.methods.docs(docs[i]).call();
      items.push({
        image: eachRecord.imageHash,
        header: eachRecord.description,
        description: eachRecord.speciality,
      });
    }

    this.setState({ items });
  }
  renderDoctors = () => {
    console.log(this.state.items);
    return <Card.Group itemsPerRow={6} items={this.state.items} />;
  };
  render() {
    return (
      <Layout>
        <h3>Registered Doctors</h3>
        {this.renderDoctors()}
      </Layout>
    );
  }
}

export default doctor;
