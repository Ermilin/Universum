import { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { fade, makeStyles } from '@material-ui/core/styles';

import { NodesContext } from 'components/context/NodesContext';
import { NodeContext } from 'components/context/NodeContext';

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    zIndex: 9999,
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.1),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
    zIndex: 9999,
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const SearchBar = () => {
  const [nodesContext, setNodesContext] = useContext(NodesContext);
  const [nodeContext, setNodeContext] = useContext(NodeContext);
  const [value, setValue] = useState();
  const classes = useStyles();

  return (
    <div className={classes.search}>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (newValue) setNodeContext(newValue.id);
        }}
        options={nodesContext}
        getOptionLabel={(option) => option.name}
        autoComplete
        autoHighlight
        autoSelect
        style={{ width: 200 }}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size='small'
            variant='outlined'
            placeholder='Sök'
          />
        )}
      />
    </div>
  );
};

export default SearchBar;
