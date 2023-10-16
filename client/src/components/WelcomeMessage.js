import { Dialog , DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'; 
import { switchOffWelcomeWord, toggleWelcome} from '../actions'

export const WelcomeMessage = (props) => {
    const dispatch = useDispatch();
    const firstTime = useSelector(state => state.welcomeFirstTime);
    const show = useSelector(state => state.showWelcomeMessage);

    const close = () => {
        localStorage.setItem('welcome_message_shown', 'true');
        dispatch(toggleWelcome(false));
        dispatch(switchOffWelcomeWord())
    }
    return <Dialog open={show} maxWidth={false}>
        <DialogTitle>{firstTime ? 'Welcome to Krya manager!' : 'The main features are:'}</DialogTitle>
        <DialogActions>
            <Button onClick={close}>Close</Button>
        </DialogActions>
    </Dialog>
}