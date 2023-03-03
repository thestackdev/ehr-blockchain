import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Card, Icon } from "semantic-ui-react";
import Layout from "../components/Layout";
import { TransactionContext } from "../context/Entherum";

export default function Doctor() {
  const [items, setItems] = useState([]);
  const { getDoctors, getDoctor } = useContext(TransactionContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const docs = await getDoctors();
    console.log(docs);
    for (var i = 0; i < docs.length; i += 1) {
      const eachRecord = await getDoctor(docs[i]);
      setItems((e) => [
        ...e,
        {
          image: eachRecord.imageHash,
          header: eachRecord.description,
          description: eachRecord.speciality,
          extra: (
            <Link href={`/doctors/${eachRecord.doc}`}>
              <Icon name="user" />
              Select
            </Link>
          ),
        },
      ]);
    }
  };

  return (
    <Layout>
      <h3>Select your doctors</h3>
      <Card.Group itemsPerRow={6} items={items} />
    </Layout>
  );
}
