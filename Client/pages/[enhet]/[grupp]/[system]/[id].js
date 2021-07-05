import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

const NetworkGraph = dynamic(() => import('components/NetworkGraph'), {
  ssr: false,
});

const Index = () => {
  //Get URL path and fetch from corresponding API path
  const router = useRouter();
  const API = `/api${Object.keys(router.query)
    .map((key) => '/' + router.query[key])
    .join()
    .replace(',', '')}`;

  const [filter, setFilter] = useState([]);
  const [selectedNode, setSelectedNode] = useState(0);
  const { data, error } = useSWR(API);

  return (
    <>
      <Head>
        <title>Universum</title> <link rel='icon' href='/favicon.ico' />
      </Head>
      {data ? (
        <NetworkGraph
          data={data}
          filter={filter}
          handleSelectedNode={setSelectedNode}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default Index;
