import 'styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import useSWR, { SWRConfig } from 'swr';
import { request, GraphQLClient } from 'graphql-request';
import NextCrumbs from 'components/NextCrumbs';
import SearchBar from 'components/Search';
import Host from 'components/Host';
import Drawer from 'components/Drawer';
import Nav from 'components/Nav';
import styles from 'styles/Home.module.css';
import { NodesContext } from 'components/context/NodesContext';
import { NodeContext } from 'components/context/NodeContext';

const AppBar = dynamic(() => import('components/AppBar'), {
  ssr: false,
});

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#242424',
    },
    success: {
      main: '#00ff00',
    },
  },
  overrides: {
    MuiChip: {
      root: {
        backgroundColor: 'green',
        color: 'white',
      },
      colorPrimary: {
        backgroundColor: 'yellow',
        color: 'black',
      },
      colorSecondary: {
        backgroundColor: 'red',
      },
    },
  },
});

MyApp.getInitialProps = async ({ Component, ctx }) => {
  console.log(process.env.NODE_ENV);
  let pageProps = {};
  if (process.env.NODE_ENV == 'production') {
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    if (ctx.req && ctx.req.session.passport) {
      pageProps.user = ctx.req.session.passport.user;
    }
  }
  return { pageProps };
};

function MyApp({ Component, pageProps }) {
  const [nodesContext, setNodesContext] = useState([]);
  const [nodeContext, setNodeContext] = useState([]);

  const headers = { timeout: 30000, mode: 'cors' };
  const client = new GraphQLClient(process.env.GRAPHQL_URI, headers);
  console.log(pageProps.user);
  return (
    <ThemeProvider theme={darkTheme}>
      <SWRConfig
        value={{
          refreshWhenOffline: true,
          refreshWhenHidden: true,
          refreshInterval: 10000,
          dedupingInterval: 0,
          fetcher: (query) => client.request(query),
          onError: (error, key, config) => {
            if (error.status !== 403 && error.status !== 404) {
              console.log('Failed to fetch', error);
            }
          },
          onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            if (error.status === 404) return;

            setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 5000);
          },
        }}
      >
        <NodesContext.Provider value={[nodesContext, setNodesContext]}>
          <NodeContext.Provider value={[nodeContext, setNodeContext]}>
            {pageProps.user.profile.groups.includes(
              'ActiveDirectoryGroup_X'
            ) ? (
              <div className={styles.container}>
                <AppBar pageProps={pageProps} />
                <main className={styles.main}>
                  <Component {...pageProps} />
                </main>
              </div>
            ) : (
              <h1 style={{ color: 'white' }}>Insufficient permissions</h1>
            )}
          </NodeContext.Provider>
        </NodesContext.Provider>
      </SWRConfig>
    </ThemeProvider>
  );
}

export default MyApp;
