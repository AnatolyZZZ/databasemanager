import CustomModal from './universal/CustomModal';
import { useSelector, useDispatch } from 'react-redux'; 
import { switchOffWelcomeWord, toggleWelcome} from '../actions'
import { useRef, useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Popper, Paper,  ClickAwayListener , ListItemButton } from '@mui/material';
import HTMLRenderer from './universal/HTMLRenderer'
import { benefits, positions } from './enteties/welcomeMessageBenefits';
import './styles/Instructions.css'

export const WelcomeMessage = (props) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const shown = localStorage.getItem('dbm_wellcome_shown');
        if (shown) {
            dispatch(switchOffWelcomeWord());
        } else {
            dispatch(toggleWelcome(true));
        }
    }, [dispatch])
    const firstTime = useSelector(state => state.welcomeFirstTime);
    const show = useSelector(state => state.showWelcomeMessage);
    const texts = benefits;
    const pos = positions

    const copyModelRef = useRef(null);
    const copyVersionRef = useRef(null);
    const editCellRef = useRef(null);
    const constrainsRef= useRef(null);
    const filtersRef = useRef(null);
    const standartRef = useRef(null);
    const errorRef = useRef(null);
    const popperRef = useRef(null);
    const addRef = useRef(null);
    const saveRef = useRef(null);
    const pkRef = useRef(null);

    const [popperText, changePopperText] = useState('');
    const [popperOpen, openPopper] = useState(false);
    const [position, setPosition] = useState('bottom');

    const close = () => {
        localStorage.setItem('welcome_message_shown', 'true');
        dispatch(toggleWelcome(false));
        dispatch(switchOffWelcomeWord())
    }
   
    const clickHandler = (e, ref, id) => {
        e.stopPropagation()
        changePopperText(texts[id]);
        popperRef.current = ref.current;
        pos[id] ? setPosition(pos[id]) : setPosition('bottom')
        openPopper(true)
    }

    return <CustomModal 
            title={firstTime ? 'Welcome to Krya manager! The main features are (click):' : 'The main features are (click):'} 
            onClose={close}
            show={show}
            close_text={firstTime ? 'Start using' : false}
            maxWidth={false}
            >
                <List>
                    <ListItemButton ref={standartRef} onClick={(e)=> clickHandler(e, standartRef, 'standart')} >
                        <ListItemText inset>Data in convenient format</ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={(e) => clickHandler(e, editCellRef, 'edit_cell')}  ref={editCellRef}>
                        <ListItemText inset  >Edit any cell</ListItemText>
                    </ListItemButton>
                    <ListItemButton ref={copyModelRef} onClick={(e)=>clickHandler(e, copyModelRef, 'copy_model')} >
                        <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
                        <ListItemText  >Copy of a model</ListItemText>
                    </ListItemButton>
                    <ListItemButton ref={copyVersionRef} onClick={(e)=> clickHandler(e, copyVersionRef, 'copy_version')} >
                        <ListItemText inset>Copy of a version to the same or to another model</ListItemText>
                    </ListItemButton>
                    <ListItemButton ref={constrainsRef} onClick={(e)=> clickHandler(e, constrainsRef, 'constrains_check')} >
                        <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
                        <ListItemText>Checks if constrains are fulfilled while editing cell</ListItemText>
                    </ListItemButton>
                    <ListItemButton ref={filtersRef} onClick={(e)=> clickHandler(e, filtersRef, 'filters')} >
                        <ListItemText inset>Bult in and custom filters</ListItemText>
                    </ListItemButton>
                    <ListItemButton ref={addRef} onClick={(e)=> clickHandler(e, addRef, 'add')} >
                        <ListItemText inset>Add a new row to the table</ListItemText>
                    </ListItemButton>
                    <ListItemButton ref={errorRef} onClick={(e)=> clickHandler(e, errorRef, 'errors')} >
                        <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
                        <ListItemText>Whatch for errors on eddited cell</ListItemText>
                    </ListItemButton>
                    <ListItemButton ref={saveRef} onClick={(e)=> clickHandler(e, saveRef, 'save')} >
                        <ListItemText inset>Save everything to database</ListItemText>
                    </ListItemButton>
                    <ListItemButton ref={pkRef} onClick={(e)=> clickHandler(e, pkRef, 'pk')} >
                        <ListItemText inset>PK is not displayed by default</ListItemText>
                    </ListItemButton>
                </List>
                <Popper
                    open={popperOpen}
                    anchorEl={popperRef.current}
                    style={{ zIndex: 1300 }}
                    placement={position}
                >
                    <ClickAwayListener onClickAway={(e)=> openPopper(false)}>
                        <Paper elevation={2} sx={{p:3}}>
                            <div className='instructions'>
                                <HTMLRenderer html={popperText}/>
                            </div>
                        </Paper>
                    </ClickAwayListener>
                </Popper>
            </CustomModal>
}