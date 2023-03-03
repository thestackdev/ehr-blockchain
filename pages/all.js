import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Card, Icon } from "semantic-ui-react";
import Layout from "../components/Layout";
import { TransactionContext } from "../context/Entherum";

export default function Records() {
  const { getAllRecords, getNameAndAddress } = useContext(TransactionContext);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getAllRecords();
    for (let i = 0; i < data.length; i++) {
      const recordInstance = await getNameAndAddress(data[i]);
      console.log(recordInstance);
      setRecords((e) => [
        ...e,
        {
          image: recordInstance[1],
          header: recordInstance[0],
          description: recordInstance[2],
          fluid: true,
          extra: (
            <Link href={`/records/${data[i]}`}>
              <Icon name="user" />
              View
            </Link>
          ),
        },
      ]);
    }
  };

  console.log(records.length);

  return (
    <Layout>
      <h1>All records!!</h1>
      <Card.Group items={records} itemsPerRow={2} />
    </Layout>
  );
}
