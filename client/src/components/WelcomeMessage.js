import CustomModal from './universal/CustomModal';
import { useSelector, useDispatch } from 'react-redux'; 
import { switchOffWelcomeWord, toggleWelcome} from '../actions'
import { useRef, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FormControl, InputLabel, MenuItem, Select, Button, Popper, MenuList, Paper, Grow,  ClickAwayListener} from '@mui/material';

export const WelcomeMessage = (props) => {
    const dispatch = useDispatch();
    const firstTime = useSelector(state => state.welcomeFirstTime);
    const show = useSelector(state => state.showWelcomeMessage);
    const copyModelRef = useRef(null);
    const editCellRef = useRef(null);
    const [popperText, changePopperText] = useState('');
    const [popperOpen, openPopper] = useState(false);
    const popperRef = useRef(null);

    const close = () => {
        localStorage.setItem('welcome_message_shown', 'true');
        dispatch(toggleWelcome(false));
        dispatch(switchOffWelcomeWord())
    }
    const texts = {
        'copyModel' : 'If a Table has column "Model" you can copy all records with the same model to a new model or to the same model but with different version',
        'copyVersion' : 'If a given Model has different versions, you can copy just a desired version  to a new version in the same or in another model',
        'editCell' : 'After opening a table you can start editing any cell, by just doubleclicking on it or by selecting and clicking enter'
    }
    const clickHandler = (ref, id) => {
        changePopperText(texts[id]);
        popperRef.current = ref.current;
        openPopper(true)
    }

    return <CustomModal 
            title={firstTime ? 'Welcome to Krya manager!' : 'The main features are:'} 
            onClose={close}
            show={show}
            close_text={firstTime ? 'Start using' : false}
            >
                <List>
                    <ListItem button onClick={() => clickHandler(editCellRef, 'editCell')} >
                        <ListItemText ref={editCellRef} >Edit any cell</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
                        <ListItemText ref={copyModelRef} onClick={()=>clickHandler(copyModelRef, 'copyModel')}>Copy of model</ListItemText>
                    </ListItem>
                </List>
                <Popper
                    open={popperOpen}
                    anchorEl={popperRef.current}
                    style={{ zIndex: 1000000000000000000 }}
                >
                    
                        <ClickAwayListener onClickAway={(e)=> openPopper(false)}>
                            <Paper elevation={2}>
                                {popperText}
                            </Paper>
                        </ClickAwayListener>
                    
                </Popper>
            </CustomModal>
}

// import React from 'react';

// function HTMLRenderer() {
//   const htmlContent = '<p>This is <strong>HTML</strong> text.</p>';

//   // Use the dangerouslySetInnerHTML prop to render HTML
//   return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
// }

// export default HTMLRenderer;