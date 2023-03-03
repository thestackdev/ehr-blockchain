import { create } from "ipfs-http-client";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { Button, Form, Icon, Message } from "semantic-ui-react";
import Layout from "../components/Layout";
import { TransactionContext } from "../context/Entherum";

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default function Create() {
  const [state, setState] = useState({
    name: "",
    speciality: "",
    buffer: null,
    errorMessage: "",
  });

  const { manager, currentAccount, registerDoctor, loading } =
    useContext(TransactionContext);

  const router = useRouter();

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setState((e) => ({ ...e, buffer: Buffer(reader.result) }));
      console.log("buffer", state.buffer);
    };
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      // const result = await ipfs.add(state.buffer);
      const imagelink =
        "https://w7.pngwing.com/pngs/415/182/png-transparent-national-health-service-general-practitioner-physician-junior-doctor-patient-doctor-female-doctor-illustration-service-people-dentistry.png";
      await registerDoctor({
        address: state.address,
        imagelink: imagelink,
        speciality: state.speciality,
        name: state.name,
      });
      router.push("/doctors");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <h1>Loading...</h1>;

  console.log(currentAccount, manager);
  if (currentAccount.toLowerCase() !== manager.toLowerCase()) {
    return (
      <Layout>
        <h1>Sorry this page can only be accesed by the manager</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Register Doctor</h1>
      <Form onSubmit={onSubmit} error={!!state.errorMessage}>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="name"
            placeholder="name"
            onChange={(event) =>
              setState((e) => ({ ...e, name: event.target.value }))
            }
            required
          />
          <Form.Input
            fluid
            label="address"
            placeholder="address"
            required
            onChange={(event) =>
              setState((e) => ({ ...e, address: event.target.value }))
            }
          />
        </Form.Group>
        <Form.TextArea
          label="description about speciality"
          placeholder="Type here"
          required
          onChange={(event) =>
            setState((e) => ({ ...e, speciality: event.target.value }))
          }
        />
        <Form.Input
          type="file"
          label="image"
          onChange={captureFile}
          accept="image/png,image/jpeg"
        />
        <Button primary type="submit" loading={state.loading}>
          <Icon name="add circle" />
          Register
        </Button>
        <Message error header="Oops!!" content={state.errorMessage} />
      </Form>
    </Layout>
  );
}
