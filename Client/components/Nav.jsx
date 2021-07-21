import React, { useState, useEffect } from "react";
import { default as NextLink } from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { request } from "graphql-request";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { MemoryRouter } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import styles from "styles/Home.module.css";
import Divider from "@material-ui/core/Divider";

function ListItemLink(props) {
  const { to, open, text, handleClick, selected, padding } = props;
  const router = useRouter();

  return (
    <ListItem
      button
      component={RouterLink}
      selected={
        router.asPath
          .replace(/%20/g, " ")
          .replace(/oe/g, "ö")
          .replace(/ae/g, "ä")
          .replace(/ue/g, "ü") == to
      }
      to={to}
      style={{ paddingLeft: `${padding}em` }}
    >
      <NextLink href={to} replace passHref>
        <Typography variant="body2" component="p">
          {text}
        </Typography>
      </NextLink>
      {handleClick ? (
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="comments"
            onClick={() => handleClick(text)}
          >
            {open != null ? open ? <ExpandLess /> : <ExpandMore /> : null}
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
}

export default function RouterBreadcrumbs() {
  const [tree, setTree] = useState();
  const [openTabs, setOpenTabs] = useState([]);
  const { data, error } = useSWR(
    `query {
      universum {
        name
        groups {
          name
          systems {
            name
          }
        }
      }
    }`
  );

  useEffect(() => {
    if (data) {
      setTree(data.universum);
    }
  }, [data]);

  const handleClick = (item) => {
    let arr = [...openTabs];
    let index = arr.indexOf(item);

    if (arr.includes(item)) {
      arr.splice(index, 1);
    } else {
      arr.push(item);
    }
    setOpenTabs(arr);
  };

  return (
    <MemoryRouter initialEntries={["/"]} initialIndex={0}>
      <nav className={styles.nav}>
        <List component="nav">
          {tree?.map((x) => (
            <React.Fragment key={x.name}>
              <ListItemLink
                key={x.name}
                to={`/${x.name}`}
                text={x.name}
                open={openTabs.includes(x.name)}
                handleClick={() => handleClick(x.name)}
                padding={1}
              />
              <Collapse
                in={openTabs.includes(x.name)}
                timeout="auto"
                unmountOnExit
              >
                <List disablePadding>
                  {x.groups.map((y) => (
                    <React.Fragment key={y.name}>
                      <ListItemLink
                        padding={2}
                        key={y.name}
                        to={`/${x.name}/${y.name}`}
                        text={y.name}
                        open={openTabs.includes(y.name)}
                        handleClick={() => handleClick(y.name)}
                      />
                      <Collapse
                        in={openTabs.includes(y.name)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {typeof y.name != "undefined" ? (
                            y.systems.map((z) => (
                              <ListItemLink
                                key={z.name}
                                to={`/${x.name}/${y.name}/${z.name}`}
                                text={z.name}
                                padding={3}
                              />
                            ))
                          ) : (
                            <ListItemLink
                              key={"unmapped"}
                              to={`/${x.name}/${y.name}/`}
                              text={"Unmapped Link"}
                              padding={3}
                            />
                          )}
                          <Divider />
                        </List>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </nav>
    </MemoryRouter>
  );
}
