import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Card } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { TransactionContext } from "../../../context/Entherum";

export default function Doctor() {
  const [items, setItems] = useState([]);
  const { getDoctors, getDoctor, getMyDoctors, addToMyDoctors } =
    useContext(TransactionContext);
  const router = useRouter();

  const record = router.query.record;

  const fetchData = async () => {
    const docs = await getDoctors();
    const myDoctors = await getMyDoctors(record);

    const filteredDoctors = docs.filter((a) => !myDoctors.includes(a));

    for (var i = 0; i < filteredDoctors.length; i += 1) {
      const eachRecord = await getDoctor(filteredDoctors[i]);
      console.log(eachRecord);
      setItems((e) => [
        ...e,
        {
          image: eachRecord.imageHash,
          header: eachRecord.description,
          description: eachRecord.speciality,
          extra: (
            <Button
              onClick={async () => {
                addToMyDoctors(record, eachRecord.doc);
                router.back();
              }}
            >
              Select
            </Button>
          ),
        },
      ]);
    }
  };

  useEffect(() => {
    if (!record) return;
    fetchData();
  }, [router.isReady]);

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
