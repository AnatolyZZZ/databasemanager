import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { openOnCellErrorMessage } from '../actions';

export function Errors(props) {
  const dispatch = useDispatch();
  const onCellErrorsMessage = useSelector((state) => state.onCellErrorsMessage);
  const errorMessages = useSelector((state) => state.errorMessages);
  const editing = useSelector((state) => state.editing);

  const handleListKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Enter') {
      setTimeout(() => dispatch(openOnCellErrorMessage(false)), 10);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        disabled={!editing || errorMessages.length === 0}
        color="error"
        onClick={() => dispatch(openOnCellErrorMessage(!onCellErrorsMessage))}
        id="open-error-dialog-button"
        sx={{ whiteSpace: 'nowrap' }}
      >
        Show errors
      </Button>

      <Dialog
        open={onCellErrorsMessage}
        id="#error-message-dialog"
        onKeyDown={handleListKeyDown}
      >
        <DialogTitle id="#draggable-dialog-title">Error on currently editing cell:</DialogTitle>
        <DialogContent>
          {!editing ? 'You are not edditing any cell'
            : (errorMessages.length === 0) ? 'No errors detected' : errorMessages.map((elt, idx) => <p key={idx}>{elt}</p>) }
        </DialogContent>

        <DialogActions>
          <Button onClick={() => dispatch(openOnCellErrorMessage(false))}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
