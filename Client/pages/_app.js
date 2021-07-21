import "styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import dynamic from "next/dynamic";

import { useState } from "react";
import { SWRConfig } from "swr";
import { GraphQLClient } from "graphql-request";

import styles from "styles/Home.module.css";
import { NodesContext } from "components/context/NodesContext";
import { NodeContext } from "components/context/NodeContext";

const AppBar = dynamic(() => import("components/AppBar"), {
  ssr: false,
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#242424",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    success: {
      main: "#00ff00",
    },
  },
  overrides: {
    MuiChip: {
      root: {
        backgroundColor: "green",
        color: "white",
      },
      colorPrimary: {
        backgroundColor: "yellow",
        color: "black",
      },
      colorSecondary: {
        backgroundColor: "red",
      },
    },
  },
});

Universum.getInitialProps = async ({ Component, ctx }) => {
  console.log(process.env.NODE_ENV);
  let pageProps = {};
  if (process.env.NODE_ENV == "production") {
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    if (ctx.req && ctx.req.session.passport) {
      pageProps.user = ctx.req.session.passport.user;
    }
  }
  return { pageProps };
};

function Universum({ Component, pageProps }) {
  const [nodesContext, setNodesContext] = useState([]);
  const [nodeContext, setNodeContext] = useState([]);

  const headers = { timeout: 30000, mode: "cors" };
  const client = new GraphQLClient("http://localhost:5000/graphql", headers);

  return (
    <ThemeProvider theme={darkTheme}>
      <SWRConfig
        value={{
          refreshWhenHidden: true,
          refreshInterval: 30000,
          fetcher: (query) => client.request(query),
          onError: (error, key, config) => {
            if (error.status !== 403 && error.status !== 404) {
              console.log("Failed to fetch", error);
            }
          },
          onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            if (error.status === 404) return;
            setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 15000);
          },
        }}
      >
        <NodesContext.Provider value={[nodesContext, setNodesContext]}>
          <NodeContext.Provider value={[nodeContext, setNodeContext]}>
            <div className={styles.container}>
              <AppBar pageProps={pageProps} />
              <main className={styles.main}>
                <Component {...pageProps} />
              </main>
            </div>
          </NodeContext.Provider>
        </NodesContext.Provider>
      </SWRConfig>
    </ThemeProvider>
  );
}

export default Universum;
