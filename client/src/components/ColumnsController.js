import {
  FormControl, FormGroup, Checkbox, FormControlLabel,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { toggleSelected } from '../actions';
import CustomModal from './universal/CustomModal';

export function ColumnsController(props) {
  const { open, opener } = props;
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Enter') {
      opener(false);
    }
  };
  const primaryKey = useSelector((state) => state.primaryKey);
  const selected_columns = useSelector((state) => state.selected_columns);
  const dispatch = useDispatch();

  const handleColumsCheck = (idx) => {
    dispatch(toggleSelected(idx));
  };

  return (
    <CustomModal
      title="Which columns to display?"
      success_text="Ok"
      onSuccess={() => opener(false)}
      show={open}
      keyDown={handleKeyDown}
    >
      <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
        <FormGroup>
          {selected_columns.map((elt, idx) => (
            <FormControlLabel
              key={idx}
              control={
                <Checkbox checked={elt[1]} onChange={() => handleColumsCheck(idx)} name={elt[0]} />
                    }
              label={elt[0] === primaryKey ? `${elt[0]} (PK)` : elt[0]}
            />
          ))}
        </FormGroup>
      </FormControl>
    </CustomModal>
  );
}
