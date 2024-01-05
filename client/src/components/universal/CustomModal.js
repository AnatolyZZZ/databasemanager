import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button,
} from '@mui/material';

// ---------- props ------------- //

// title - title of dialog

// show - show dialog or not

// maxWidth - px or false

// onSuccess - function to be executed on succsess

// success_text - text on sucsess button, default: 'Confirm'

// onClose - function to be executed on close

// close_text - text on close button, default: 'Close'

// onSecondary - function to be executed on click of secondary button

// secondary_text - text on secondary button, default: none

// disableEscapeKeyDown for disableEscapeKeyDown

// mainButtonStyles - object  {variant, color}

// keyDown - fucction to be execuded on keydown 

function CustomModal(props) {
  return (
    <Dialog open={props.show} maxWidth={props.maxWidth || false} disableEscapeKeyDown={props.disableEscapeKeyDown || false} onKeyDown={props.keyDown}>
      {props.title && <DialogTitle>{props.title}</DialogTitle>}
      <DialogContent>
        {props.children}
      </DialogContent>
      <DialogActions>
        {props.onSuccess && <Button 
                            onClick={props.onSuccess} 
                            disabled={props.mainDisabled}
                            variant={props.mainButtonStyles?.variant || 'text'}
                            color={props.mainButtonStyles?.color || 'primary'}
                            >
                              {props.success_text || 'Confirm'}
                            </Button>}
        {props.onClose && <Button onClick={() => props.onClose()}>{props.close_text || 'Close'}</Button>}
        {props.onSecondary && <Button onClick={props.onSecondary}>{props.secondary_text}</Button>}
      </DialogActions>
    </Dialog>
  );
}

export default CustomModal;
