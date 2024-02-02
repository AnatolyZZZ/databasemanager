import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, Stack, Switch, FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Filter } from './Filter';
import { applyFilters, newFilter } from '../actions';

export function Filters() {
  const table_name = useSelector((state) => state.table_name);
  const filters = useSelector((state) => state.filters);
  const [filtersDialog, openFiltersDialog] = useState(false);
  const editing = useSelector((state) => state.editing);
  const apply_filters = useSelector((state) => state.apply_filters);
  const dispatch = useDispatch();

  const handleListKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Enter') {
      setTimeout(() => openFiltersDialog(false), 10);
    }
  };

  return (
    <>
      <Button
        color="secondary"
        variant="outlined"
        disabled={editing || table_name === ''}
        onClick={() => { openFiltersDialog(true); }}
      >
        Filters
      </Button>
      <Dialog open={filtersDialog} maxWidth={false} onKeyDown={handleListKeyDown}>
        <DialogContent>
          { // eslint-disable-next-line
          filters[table_name]?.map((elt, idx) => <Filter key={idx} table={table_name} id={idx} />)}

          <Stack direction="row" justifyContent="center">
            <Button color="success" onClick={() => dispatch(newFilter(table_name))}>
              {' '}
              New
              <AddIcon />
            </Button>
          </Stack>

        </DialogContent>

        <DialogActions>
          <FormControlLabel
            control={(
              <Switch
                onChange={(e) => dispatch(applyFilters(e.target.checked))}
                checked={apply_filters}
                color="warning"
              />
)}
            label="Apply filters"
          />
          <Button onClick={() => openFiltersDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
