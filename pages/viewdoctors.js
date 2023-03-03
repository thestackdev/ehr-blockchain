import React, { useContext, useEffect, useState } from "react";
import { Card } from "semantic-ui-react";
import Layout from "../components/Layout";
import { TransactionContext } from "../context/Entherum";

export default function Doctors() {
  const [items, setItems] = useState([]);
  const { getDoctors, getDoctor } = useContext(TransactionContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const docs = await getDoctors();
    for (var i = 0; i < docs.length; i += 1) {
      const eachRecord = await getDoctor(docs[i]);
      setItems((e) => [
        ...e,
        {
          image: eachRecord.imageHash,
          header: eachRecord.description,
          description: eachRecord.speciality,
        },
      ]);
    }
  };

  return (
    <Layout>
      <h3>Registered Doctors</h3>
      <Card.Group itemsPerRow={6} items={items} />
    </Layout>
  );
}
