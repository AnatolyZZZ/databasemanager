import CustomModal from './universal/CustomModal';
import { useSelector, useDispatch } from 'react-redux'; 
import { switchOffWelcomeWord, toggleWelcome} from '../actions'
import { useRef, useState } from 'react';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Popper, Paper,  ClickAwayListener , ListItemButton } from '@mui/material';
import HTMLRenderer from './universal/HTMLRenderer'
import { benefits } from './enteties/welcomeMessageBenefits';

export const WelcomeMessage = (props) => {
    const dispatch = useDispatch();
    const firstTime = useSelector(state => state.welcomeFirstTime);
    const show = useSelector(state => state.showWelcomeMessage);
    const copyModelRef = useRef(null);
    const copyVersionRef = useRef(null);
    const editCellRef = useRef(null);
    const constrainsRef= useRef(null)
    const [popperText, changePopperText] = useState('');
    const [popperOpen, openPopper] = useState(false);
    const popperRef = useRef(null);

    const close = () => {
        localStorage.setItem('welcome_message_shown', 'true');
        dispatch(toggleWelcome(false));
        dispatch(switchOffWelcomeWord())
    }
    const texts = benefits;

    const clickHandler = (ref, id) => {
        changePopperText(texts[id]);
        popperRef.current = ref.current;
        openPopper(true)
    }

    return <CustomModal 
            title={firstTime ? 'Welcome to Krya manager! The main features are (click):' : 'The main features are (click):'} 
            onClose={close}
            show={show}
            close_text={firstTime ? 'Start using' : false}
            maxWidth={false}
            >
                <List disableGutters>
                    <ListItemButton onClick={() => clickHandler(editCellRef, 'edit_cell')}  ref={editCellRef}>
                        <ListItemText inset  >Edit any cell</ListItemText>
                    </ListItemButton>
                    <ListItemButton ref={copyModelRef} onClick={()=>clickHandler(copyModelRef, 'copy_model')} >
                        <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
                        <ListItemText  >Copy of a model</ListItemText>
                    </ListItemButton>
                    <ListItemButton ref={copyVersionRef} onClick={()=> clickHandler(copyVersionRef, 'copy_version')} >
                        <ListItemText inset>Copy of a version to the same or to another model</ListItemText>
                    </ListItemButton>
                    <ListItemButton ref={constrainsRef} onClick={()=> clickHandler(constrainsRef, 'constrains_check')} >
                        <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
                        <ListItemText>Checks if constrains fulfilled while editing cell</ListItemText>
                    </ListItemButton>
                </List>
                <Popper
                    open={popperOpen}
                    anchorEl={popperRef.current}
                    style={{ zIndex: 1300 }}
                    placement='bottom-end'
                >
                    
                        <ClickAwayListener onClickAway={(e)=> openPopper(false)}>
                            <Paper elevation={2} sx={{p:2}}>
                                <HTMLRenderer html={popperText}/>
                            </Paper>
                        </ClickAwayListener>
                    
                </Popper>
            </CustomModal>
}