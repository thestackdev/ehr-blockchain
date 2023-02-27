import React, { Component } from "react";
import { Button, Card, Icon } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import web3 from "../ethereum/web3";
import Record from "../ethereum/record";
import { Link } from "../routes";
class recordIndex extends Component {
  state = {
    items: [],
  };
  static async getInitialProps() {
    const records = await factory.methods.getDeployedRecords().call();
    return { records };
  }
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const items = [];
    console.log(this.props.records.length);
    for (var i = 0; i < this.props.records.length; i++) {
      const recordInstance = Record(this.props.records[i]);
      console.log(recordInstance.options.address);
      const eachRecord = await recordInstance.methods
        .getNameandAddress()
        .call({ from: accounts[0] });
      items.push({
        image: eachRecord[1],
        header: eachRecord[0],
        description: eachRecord[2],
        fluid: true,
        extra: (
          <Link route={`/Records/${this.props.records[i]}`}>
            <a>
              <Icon name="user" />
              View
            </a>
          </Link>
        ),
      });
    }
    this.setState({ items });
  }
  renderRecords() {
    return <Card.Group items={this.state.items} itemsPerRow={2} />;
  }

  render() {
    return (
      <Layout>
        <h1>All records!!</h1>
        {this.renderRecords()}
      </Layout>
    );
  }
}

export default recordIndex;
