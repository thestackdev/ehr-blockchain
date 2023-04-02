import _ from "lodash";
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
    getMyDoctors,
  } = useContext(TransactionContext);

  const [message, setMessage] = useState("");
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const recordAddress = router.query.address;

  const fetchData = async () => {
    try {
      console.log(recordAddress);
      const NameAndImage = await getNameAndAddress(recordAddress);

      console.log(currentAccount);

      console.log(
        NameAndImage[3]
          .map((e) => e.toUpperCase())
          .includes(currentAccount.toUpperCase())
      );

      if (
        currentAccount.toUpperCase() === NameAndImage[2].toUpperCase() ||
        NameAndImage[3]
          .map((e) => e.toUpperCase())
          .includes(currentAccount.toUpperCase())
      ) {
      } else {
        setMessage("NA");
        return;
      }

      const doctors = [];

      for (let i = 0; i < NameAndImage[3].length; i++) {
        const doctor = await getDoctor(NameAndImage[3][i]);
        doctors.push({
          id: doctor.doc,
          image: doctor.imageHash,
          header: doctor.description,
          description: doctor.speciality,
        });
      }

      const details = await getDetails(recordAddress);

      const prescriptionlength = await getPrescriptionLength(recordAddress);
      const reportLength = await getReportLength(recordAddress);

      let prescriptions = [];

      for (let i = 0; i < prescriptionlength; i++) {
        const prescriptionlink = await getPrescription(recordAddress, i);
        prescriptions.push({
          hash: prescriptionlink.hash,
          doctor: prescriptionlink.doctor,
        });
      }

      prescriptions = _.groupBy(prescriptions, "doctor");

      let reports = [];
      for (let i = 0; i < reportLength; i++) {
        const reportLink = await getReport(recordAddress, i);
        reports.push({
          hash: reportLink.hash,
          doctor: reportLink.doctor,
        });
      }

      reports = _.groupBy(reports, "doctor");

      setState({
        NameAndImage,
        details,
        reports,
        prescriptions,
        doctors,
        message,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!recordAddress || !currentAccount) return;
    fetchData();
  }, [router.isReady, currentAccount]);

  if (loading) return <span>Loading...</span>;

  console.log(message);

  if (message === "NA") {
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
            {Object.keys(state.prescriptions).map((key) => (
              <div className="flex flex-col">
                <p>{state.doctors.filter((e) => e.id === key)[0]?.header}</p>
                {state.prescriptions[key].map((prescription, pIndex) => (
                  <Link className="my-2" href={prescription.hash}>
                    <Icon name="file alternate" />{" "}
                    {" Prescription - " + (pIndex + 1)}
                  </Link>
                ))}
              </div>
            ))}
            <Label as="a" color="teal" ribbon>
              report links
            </Label>
            <p></p>
            {Object.keys(state.reports).map((key) => (
              <div className="flex flex-col">
                <p>{state.doctors.filter((e) => e.id === key)[0]?.header}</p>
                {state.reports[key].map((reports, pIndex) => (
                  <Link className="my-2" href={reports.hash}>
                    <Icon name="file alternate" /> {" Report - " + (pIndex + 1)}
                  </Link>
                ))}
              </div>
            ))}
            <Label as="a" color="pink" ribbon>
              your doctors
            </Label>
            <div className="mt-6"></div>
            <Card.Group items={state.doctors} itemsPerRow={6} />
            <div className="mt-6 flex flex-col w-fit gap-4">
              <Button
                primary
                className="mt-10"
                onClick={() =>
                  router.push(`/records/update/doctor?record=${recordAddress}`)
                }
              >
                <Icon name="add circle" />
                Add Doctor
              </Button>
              {currentAccount.toUpperCase() ===
                state.NameAndImage[2].toUpperCase() ||
                (state.NameAndImage[3]
                  .map((e) => e.toUpperCase())
                  .includes(currentAccount.toUpperCase()) && (
                  <Button
                    primary
                    onClick={() =>
                      router.push(`/records/update/${recordAddress}`)
                    }
                  >
                    <Icon name="add circle" />
                    Add prescription or report
                  </Button>
                ))}
            </div>
          </Segment>
        </Grid.Column>
      </Grid>
    </Layout>
  );
}
