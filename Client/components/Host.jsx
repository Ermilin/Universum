import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';

import Typography from '@material-ui/core/Typography';
import { NodeContext } from 'components/context/NodeContext';
import { NodesContext } from 'components/context/NodesContext';
import Chip from 'components/Chip';

import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

const useStyles = makeStyles((theme) => ({
  list: {
    gridColumn: 3,
    gridRow: 2,
    position: 'fixed',
    padding: theme.spacing(1),
    bottom: 0,
    right: 0,
  },
  root: {
    minWidth: 0,
    position: 'relative',
  },
  objectKey: {
    color: 'rgba(217,106,225)',
  },
  objectValue: {
    color: 'rgba(220,61,57)',
  },
  table: {
    right: 0,
    width: '400px',
  },
  close: {
    position: 'absolute',
    right: 0,
  },
}));

function setStyle(key, value) {
  if (key == 'code') {
    if (value == 'Warning') {
      return { backgroundColor: 'yellow', color: 'black' };
    }
    if (value == 'Critical') {
      return { backgroundColor: 'red', color: 'black' };
    }
    if (value == 'OK') {
      return { backgroundColor: 'green' };
    }
  }
}
function chipColor(value) {
  if (value == 'Warning') {
    return 'primary';
  }
  if (value == 'Critical') {
    return 'secondary';
  }
}

const Host = () => {
  const [nodeContext, setNodeContext] = useContext(NodeContext);
  const [nodesContext, setNodesContext] = useContext(NodesContext);

  const [open, setOpen] = useState(true);
  const [alert, setAlert] = useState(false);
  const [selectedNode, setSelectedNode] = useState();
  const classes = useStyles();

  useEffect(() => {
    if (nodeContext != undefined && nodeContext.length != 0) {
      setSelectedNode(nodesContext.filter((x) => x.id == nodeContext)[0]);
    }
  }, [nodeContext]);

  const handleClick = () => {
    setAlert(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlert(false);
  };
  function clipBoard(text) {
    navigator.clipboard.writeText(text).then(
      function () {
        console.log('Copied text: ' + text);
        handleClick(text);
      },
      function (err) {
        console.error('Async: Could not copy text: ', err);
      }
    );
  }

  return (
    <>
      <List
        className={classes.root}
        component='nav'
        aria-labelledby='nested-list-subheader'
      ></List>

      <Collapse
        in={typeof selectedNode == 'object'}
        timeout='auto'
        unmountOnExit
        className={classes.list}
      >
        {selectedNode ? (
          <Card className={classes.root}>
            <IconButton
              aria-label='delete'
              className={classes.close}
              onClick={() => setSelectedNode(false)}
            >
              <CloseOutlinedIcon fontSize='normal' />
            </IconButton>
            <CardContent>
              <TableContainer className={classes.paper}>
                <Table
                  className={classes.table}
                  size='small'
                  aria-label='node info'
                >
                  <TableBody>
                    {Object.keys(selectedNode).map((key) => {
                      if (key == 'id') return;

                      if (key == 'name')
                        return (
                          <Typography variant='h5' component='h2'>
                            {selectedNode[key]}
                          </Typography>
                        );

                      if (key == 'label')
                        return (
                          <Typography
                            className={classes.pos}
                            color='textSecondary'
                          >
                            {selectedNode[key]}
                          </Typography>
                        );

                      if (typeof selectedNode[key] == 'object') {
                        if (key == 'status') {
                          if (!selectedNode[key].comment)
                            return (
                              <Chip
                                label={selectedNode[key].code}
                                color={chipColor(selectedNode[key].code)}
                              />
                            );

                          return (
                            <Chip
                              label={selectedNode[key].comment}
                              color={chipColor(selectedNode[key].code)}
                            />
                          );
                        } else {
                          return selectedNode[key] ? (
                            <Table size='small' aria-label='node info'>
                              <TableRow
                                key={key}
                                onClick={() => clipBoard(selectedNode[key])}
                              >
                                <TableCell
                                  component='th'
                                  scope='row'
                                  align='right'
                                >
                                  {key}
                                </TableCell>
                              </TableRow>
                              {Object.keys(selectedNode[key]).map((nestedKey) =>
                                selectedNode[key][nestedKey] ? (
                                  <TableRow
                                    key={nestedKey}
                                    onClick={() => clipBoard(selectedNode[key])}
                                  >
                                    <Box component='span' pl={2}>
                                      <TableCell component='th' scope='row'>
                                        {nestedKey}
                                      </TableCell>
                                      <TableCell
                                        style={setStyle(
                                          nestedKey,
                                          selectedNode[key][nestedKey]
                                        )}
                                        align='right'
                                      >
                                        {selectedNode[key][nestedKey]}
                                        <Chip
                                          label={selectedNode[key][nestedKey]}
                                          color='error.main'
                                        />
                                      </TableCell>
                                    </Box>
                                  </TableRow>
                                ) : (
                                  ''
                                )
                              )}
                            </Table>
                          ) : (
                            ''
                          );
                        }
                      } else {
                        return key ? (
                          <TableRow
                            key={key}
                            onClick={() => clipBoard(selectedNode[key])}
                          >
                            <TableCell component='th' scope='row'>
                              {key}
                            </TableCell>
                            <TableCell>{selectedNode[key]}</TableCell>
                          </TableRow>
                        ) : (
                          ''
                        );
                      }
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ) : (
          ''
        )}
      </Collapse>
    </>
  );
};

export default Host;
