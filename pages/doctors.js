import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Card, Icon } from "semantic-ui-react";
import Layout from "../components/Layout";
import { TransactionContext } from "../context/Entherum";

export default function Doctor() {
  const [items, setItems] = useState([]);
  const { getDoctors, getDoctor, getMyRecords } =
    useContext(TransactionContext);

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
      {!items.length ? (
        <div className="w-full mt-10">
          <h3 className="text-2xl font-bold text-center">
            This network doesn't have any doctors yet!
          </h3>
        </div>
      ) : (
        <Card.Group itemsPerRow={6} items={items} />
      )}
    </Layout>
  );
}
