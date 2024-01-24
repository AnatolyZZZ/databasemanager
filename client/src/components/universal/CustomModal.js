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
  const {
    show, maxWidth, disableEscapeKeyDown, keyDown, title, onSuccess, mainDisabled, mainButtonStyles,
    children, success_text, onClose, close_text, onSecondary, secondary_text,
  } = props;
  return (
    <Dialog
      open={show}
      maxWidth={maxWidth || false}
      disableEscapeKeyDown={disableEscapeKeyDown || false}
      onKeyDown={keyDown}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        {onSuccess && (
        <Button
          onClick={onSuccess}
          disabled={mainDisabled}
          variant={mainButtonStyles?.variant || 'text'}
          color={mainButtonStyles?.color || 'primary'}
        >
          {success_text || 'Confirm'}
        </Button>
        )}
        {onClose && <Button onClick={() => onClose()}>{close_text || 'Close'}</Button>}
        {onSecondary && <Button onClick={onSecondary}>{secondary_text}</Button>}
      </DialogActions>
    </Dialog>
  );
}

export default CustomModal;
