import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openOnCellErrorMessage } from "../actions";

export const Errors = (props) => {
    // strange problem appeared: when using hotkey both useHotkey and pressing button happens 
    // so first Hotkey changes onCellErrorMessage to false then button shows it again 
    // therefore I'm using this additional state
    const [closedByHotkey, setClosedByHotkey] = useState(false);
    const dispatch = useDispatch();
    const onCellErrorsMessage = useSelector(state => state.onCellErrorsMessage);
    const errorMessages = useSelector(state => state.errorMessages);
    const editing = useSelector(state => state.editing);

    const handleListKeyDown = (e) => {
        if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Enter' ) {
            setTimeout(()=>dispatch(openOnCellErrorMessage(false)), 10)
        }
    }


return <>
<Button 
        variant='outlined'
        disabled={!editing || errorMessages.length === 0}
        color="error"
        onClick={()=>{
            if (!closedByHotkey) {
                dispatch(openOnCellErrorMessage(!onCellErrorsMessage))
                setClosedByHotkey(false)
            }
        }}
        id='open-error-dialog-button'>
            Show errors
    </Button>

<Dialog 
        open={onCellErrorsMessage}
        id='#error-message-dialog'
        onKeyDown={handleListKeyDown}
     > 
        <DialogTitle id="#draggable-dialog-title">Error on currently editing cell:</DialogTitle>
        <DialogContent>
            {!editing ? "You are not edditing any cell" :
            (errorMessages.length === 0) ? 'No errors detected' : errorMessages.map((elt, idx) => <p key={idx}>{elt}</p>) }
        </DialogContent>

        <DialogActions>
            <Button onClick={()=> dispatch(openOnCellErrorMessage(false))}>Close</Button>
        </DialogActions>
    </Dialog>
</>}