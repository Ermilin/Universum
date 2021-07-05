import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

const NetworkGraph = dynamic(() => import('components/NetworkGraph'), {
  ssr: false,
});

export default function Home() {
  const [filter, setFilter] = useState([]);
  const [selectedNode, setSelectedNode] = useState(0);
  const { data, error } = useSWR(
    `query {
      universum {
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
    }`
  );

  return (
    <>
      <Head>
        <title>Universum</title> <link rel='icon' href='/favicon.ico' />
      </Head>

      {data ? (
        <NetworkGraph
          data={data.universum}
          filter={filter}
          handleSelectedNode={setSelectedNode}
        />
      ) : (
        ''
      )}
    </>
  );
}
