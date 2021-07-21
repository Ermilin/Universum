import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import useSWR from "swr";

const NetworkGraph = dynamic(() => import("components/NetworkGraph"), {
  ssr: false,
});

const Index = () => {
  const router = useRouter();

  const SYSTEM_BY_ID = /* GraphQL */ `
  query {
    dept(name: "${router.query.enhet}", group: "${router.query.grupp}", system: "${router.query.system}") {
      name
      groups {
        name
        systems {
          name
          entities {
            id
            name
            label
            status {
              code
              comment
            }
            operatingSystem
            IP
          }
        }
      }
    }
  }
  `;

  const [filter, setFilter] = useState([]);
  const [selectedNode, setSelectedNode] = useState(0);
  const { data, error } = useSWR(SYSTEM_BY_ID);

  return (
    <>
      <Head>
        <title>Universum | {router.query.system}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {data ? (
        <NetworkGraph
          data={data.dept}
          filter={filter}
          handleSelectedNode={setSelectedNode}
        />
      ) : null}
    </>
  );
};

export default Index;
