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
    const tmpRecords = [];
    for (let i = 0; i < data.length; i++) {
      const recordInstance = await getNameAndAddress(data[i]);
      console.log(recordInstance);
      tmpRecords.push({
        image: recordInstance[1],
        header: recordInstance[0],
        fluid: true,
        extra: (
          <Link href={`/records/${data[i]}`}>
            <Icon name="user" />
            View
          </Link>
        ),
      });

      setRecords([...tmpRecords]);
    }
  };

  return (
    <Layout>
      {!records.length ? (
        <div className="w-full mt-10">
          <h3 className="text-2xl font-bold text-center">
            This network doesn't have any records yet!
          </h3>
        </div>
      ) : (
        <Card.Group items={records} itemsPerRow={6} />
      )}
    </Layout>
  );
}
