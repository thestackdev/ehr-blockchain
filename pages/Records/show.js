import React, { Component } from "react";
import {
  Grid,
  Segment,
  Label,
  Image,
  Card,
  Button,
  Icon,
} from "semantic-ui-react";
import Layout from "../../components/Layout";
import record from "../../ethereum/record";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";
import { Link } from "../../routes";
class recordShow extends Component {
  static async getInitialProps(props) {
    let message = "";
    const recordAddress = props.query.address;
    const accounts = await web3.eth.getAccounts();
    const currentRecord = record(props.query.address);
    const NameAndImage = await currentRecord.methods
      .getNameandAddress()
      .call({ from: accounts[0] });
    if (accounts[0] != NameAndImage[2] && accounts[0] != NameAndImage[3]) {
      message = "NA";
      return { message };
    }
    const doctor = await factory.methods.docs(NameAndImage[3]).call();
    const details = await currentRecord.methods
      .getDetails()
      .call({ from: accounts[0] });
    const prescriptionlength = await currentRecord.methods
      .getPrescriptionLength()
      .call({ from: accounts[0] });
    const reportLength = await currentRecord.methods
      .getReportLength()
      .call({ from: accounts[0] });
    const prescriptions = [];
    for (var i = 0; i < prescriptionlength; i++) {
      const prescriptionlink = await currentRecord.methods
        .getPrescription(i)
        .call({ from: accounts[0] });
      prescriptions.push(
        <p>
          <Link href={prescriptionlink}>
            <a target="_blank">
              <Button>
                <Icon name="file alternate outline" />
                prescription {i + 1}
              </Button>
            </a>
          </Link>
        </p>
      );
    }
    const reports = [];
    for (var i = 0; i < reportLength; i++) {
      const reportLink = await currentRecord.methods
        .getReport(i)
        .call({ from: accounts[0] });
      reports.push(
        <p>
          <Link href={reportLink}>
            <a target="_blank">
              <Button>
                <Icon name="file alternate outline" />
                report {i + 1}
              </Button>
            </a>
          </Link>
        </p>
      );
    }
    return {
      NameAndImage,
      details,
      accounts,
      reports,
      prescriptions,
      doctor,
      message,
      recordAddress,
    };
  }

  renderDoctor() {
    return (
      <Card>
        <Image
          src={this.props.doctor.imageHash}
          style={{
            maxWidth: "150px",
            maxHeight: "150px",
            display: "block",
          }}
        />
        <Card.Content>
          <Card.Header content={this.props.doctor.description} />
          <Card.Description content={this.props.doctor.speciality} />
        </Card.Content>
      </Card>
    );
  }
  renderLink() {
    if (this.props.accounts[0] == this.props.NameAndImage[3]) {
      return (
        <Link
          route={`/Records/${this.props.recordAddress}/${this.props.NameAndImage[3]}`}
        >
          <a>
            <Button primary>
              <Icon name="add circle" />
              add prescription or report
            </Button>
          </a>
        </Link>
      );
    }
  }
  render() {
    console.log(this.props);
    if (this.props.message == "NA") {
      return (
        <Layout>
          <h1>You cant access this profile</h1>
        </Layout>
      );
    }
    return (
      <Layout>
        <Grid columns={1}>
          <Grid.Column>
            <Segment raised>
              <Label as="a" color="red" ribbon>
                Overview
              </Label>
              <span>Name and profile image</span>
              <h3>{this.props.NameAndImage[0]}</h3>

              <Image
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  display: "block",
                }}
                src={this.props.NameAndImage[1]}
              />
              <p></p>
              <Label as="a" color="blue" ribbon>
                Details
              </Label>
              <span>your details</span>
              <p></p>
              <p>Age: {this.props.details[1]}</p>
              <p>height: {this.props.details[2]}</p>
              <p>weight: {this.props.details[3]}</p>
              <p>gender: {this.props.details[4]}</p>
              <Label as="a" color="orange" ribbon>
                prescription links
              </Label>
              <p></p>
              <p>{this.props.prescriptions}</p>
              <Label as="a" color="teal" ribbon>
                report links
              </Label>
              <p></p>
              <p>{this.props.reports}</p>
              <Label as="a" color="pink" ribbon>
                your doctor
              </Label>
              {this.renderDoctor()}
            </Segment>
          </Grid.Column>
        </Grid>
        <p></p>
        {this.renderLink()}
      </Layout>
    );
  }
}

export default recordShow;
