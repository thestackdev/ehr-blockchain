import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Grid,
  Icon,
  Image,
  Label,
  Segment,
} from "semantic-ui-react";
import Layout from "../../components/Layout";
import { TransactionContext } from "../../context/Entherum";

export default function ShowRecord() {
  const router = useRouter();

  const {
    currentAccount,
    getNameAndAddress,
    getDoctor,
    getDetails,
    getPrescriptionLength,
    getReportLength,
    getPrescription,
    getReport,
  } = useContext(TransactionContext);

  const [message, setMessage] = useState("");
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    fetchData();
  }, [router.isReady]);

  const fetchData = async () => {
    const recordAddress = router.query.address;

    const NameAndImage = await getNameAndAddress(recordAddress);

    if (
      currentAccount != NameAndImage[2] &&
      currentAccount != NameAndImage[3]
    ) {
      //   setMessage("NA");
      //   setLoading(false);
      //   return;
    }

    const doctor = await getDoctor(NameAndImage[3]);

    const details = await getDetails(recordAddress);

    const prescriptionlength = await getPrescriptionLength(recordAddress);
    const reportLength = await getReportLength(recordAddress);

    const prescriptions = [];

    for (let i = 0; i < prescriptionlength; i++) {
      const prescriptionlink = await getPrescription(recordAddress, i);
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
    for (let i = 0; i < reportLength; i++) {
      const reportLink = await getReport(recordAddress, i);
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
    setState({
      NameAndImage,
      details,
      reports,
      prescriptions,
      doctor,
      message,
      recordAddress,
    });
    setLoading(false);
  };

  if (loading) return <span>Loading...</span>;

  if (message == "NA") {
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
            <h3>{state.NameAndImage[0]}</h3>
            <Image
              style={{
                maxWidth: "150px",
                maxHeight: "150px",
                display: "block",
              }}
              src={state.NameAndImage[1]}
            />
            <p></p>
            <Label as="a" color="blue" ribbon>
              Details
            </Label>
            <span>your details</span>
            <p></p>
            <p>Age: {state.details[1]}</p>
            <p>height: {state.details[2]}</p>
            <p>weight: {state.details[3]}</p>
            <p>gender: {state.details[4]}</p>
            <Label as="a" color="orange" ribbon>
              prescription links
            </Label>
            <p></p>
            <p>{state.prescriptions}</p>
            <Label as="a" color="teal" ribbon>
              report links
            </Label>
            <p></p>
            <p>{state.reports}</p>
            <Label as="a" color="pink" ribbon>
              your doctor
            </Label>
            <Card>
              <Image
                src={state.doctor.imageHash}
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  display: "block",
                }}
              />
              <Card.Content>
                <Card.Header content={state.doctor.description} />
                <Card.Description content={state.doctor.speciality} />
              </Card.Content>
            </Card>
          </Segment>
        </Grid.Column>
      </Grid>
      {currentAccount == state.NameAndImage[3] && (
        <Link href={`/records/${state.recordAddress}/${state.NameAndImage[3]}`}>
          <Button primary>
            <Icon name="add circle" />
            add prescription or report
          </Button>
        </Link>
      )}
    </Layout>
  );
}
