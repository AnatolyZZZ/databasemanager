import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { openOnCellErrorMessage } from '../actions';
import CustomModal from './universal/CustomModal';

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

  const closeModal = () => dispatch(openOnCellErrorMessage(false))
  
  return (
    <>
      <Button
        variant="outlined"
        disabled={!editing || errorMessages.length === 0}
        color="error"
        onClick={() => dispatch(openOnCellErrorMessage(!onCellErrorsMessage))}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Show errors
      </Button>

      <CustomModal
        show={onCellErrorsMessage}
        title='Error on currently editing cell:'
        onClose={closeModal}
        keyDown={handleListKeyDown}
      >
      <>{ 
        !editing ? 
          'You are not edditing any cell'
          :
          (errorMessages.length === 0) ?
            'No errors detected'
            :
            errorMessages.map((elt, idx) => <p key={idx}>{elt}</p>)
      }</>
      </CustomModal>
    </>
  );
}
