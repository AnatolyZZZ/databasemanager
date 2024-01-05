import { useDispatch, useSelector } from "react-redux";
import { setAlertError }from '../actions';
import { Alert, IconButton, Collapse } from '@mui/material';
import { Close } from '@mui/icons-material';
export const MyAlert = (props) => {
    const alertOpen = useSelector((state) => state.alertErrorOn);
    const alertMessage = useSelector((state) => state.alertErrorMessage);
    const dispatch = useDispatch ();

    return <Collapse in={alertOpen}>
    <Alert
      severity="error"
      id="main-alert"
      action={(
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            dispatch(setAlertError(false));
          }}
        >
          <Close fontSize="inherit" />
        </IconButton>
          )}
      sx={{ mb: props.customMarginBottom || 2 }}
    >
      {alertMessage}
    </Alert>
  </Collapse>
}