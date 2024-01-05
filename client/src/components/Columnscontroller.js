import {
  Dialog, DialogActions, DialogContent, FormControl, FormGroup, Checkbox, FormControlLabel, Button, DialogTitle,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { toggleSelected } from '../actions';

export function ColumnsController(props) {
  const handleListKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Enter') {
      props.opener(false);
    }
  };
  const primaryKey = useSelector((state) => state.primaryKey);
  const selected_columns = useSelector((state) => state.selected_columns);
  const dispatch = useDispatch();

  const handleColumsCheck = (idx) => {
    dispatch(toggleSelected(idx));
  };

  return (
    <Dialog open={props.open} onKeyDown={handleListKeyDown}>
      <DialogTitle>Which columns to display?</DialogTitle>

      <DialogContent>
        <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
          <FormGroup>
            {selected_columns.map((elt, idx) => (
              <FormControlLabel
                key={idx}
                control={
                  <Checkbox checked={elt[1]} onChange={(e) => handleColumsCheck(idx)} name={elt[0]} />
                    }
                label={elt[0] === primaryKey ? `${elt[0]} (PK)` : elt[0]}
              />
            ))}
          </FormGroup>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => props.opener(false)}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
