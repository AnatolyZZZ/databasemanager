import { CurrTable } from "./Currtable";
import { WelcomeMessage } from './WelcomeMessage'
import { Controllers } from './Controllers'
import { NewTable } from "./Newtable";
import { setTable, setNewTableRows, openNewRow, setAlertErrorMessage, setAlertError, setEditMode, openOnCellErrorMessage} from '../actions'
import { Dialog , DialogActions, DialogContent, DialogTitle, Button, Alert, IconButton, Collapse } from '@mui/material';
import { Close } from '@mui/icons-material'
import { useSelector, useDispatch } from "react-redux";
// import { Link } from 'react-router-dom'



export const HomePage = (props) => {
    const dispatch = useDispatch();
    const newTableRows = useSelector(state => state.newTableRows);
    const cur_table = useSelector(state => state.table);
    const table_name = useSelector(state => state.table_name);
    const root_url = useSelector(state => state.root_url);
    const editable = useSelector(state => state.editable_columns);
    const primaryKey = useSelector(state => state.primaryKey);
    const editNewRowDialogOpen = useSelector(state => state.newRow);
    const constrains = useSelector(state => state.constrains);
    const alertOpen = useSelector(state => state.alerErrorOn);
    const alertMessage = useSelector(state => state.alertErrorMessage);
    const editing = useSelector(state => state.editing);

    const setNewTableRowToDefault = ()=> {
        // console.log('runing', editable)
        const editRow = [{[primaryKey] : 1}];
        editable.forEach(elt => editRow[0][elt]='');
        dispatch(setNewTableRows(editRow))
    }

    const saveToDatabase = async () => {
        /// we dont send to DB rows with id as it is probably PK
        const readyToUpd = [...newTableRows];
        for (let key in readyToUpd) {
   
            let newRowWithNoKey = {...readyToUpd[key]}
            // del PK only if it is nextVal 
            if(String(constrains[primaryKey]['defaultValue']).slice(0,8) === 'nextval(') {
                delete newRowWithNoKey[primaryKey];
                console.log('deleting')
            }
            readyToUpd[key] = newRowWithNoKey
        }
        // console.log('ready to upd', readyToUpd)
        const para = {
            method : 'POST',
            headers : {'Content-type' : 'application/json'},
            body : JSON.stringify(
                {
                    table : table_name,
                    rows : readyToUpd
                }
            )
        }
        
        try {
            dispatch({type: 'SET_LOADING', payload: true})
            const res = await fetch(`${root_url}/api/table`, para);
            if (res.status === 200) {
                // should clear everything in newTable 
                setNewTableRowToDefault();

                const body = await res.json()
                const newTable = [...cur_table];
                for (let row of body) {
                    newTable.push(row);
                }
                dispatch(setTable(newTable));
                dispatch({type: 'SET_LOADING', payload: false});
                // and finaly closing creating new table
                dispatch(openNewRow(false));
            } else {
                const body = await res.json()
                // console.log('res body.msg',body.msg);
                throw new Error(body.msg)
            }
        } catch (error) {
            console.log('err message',error.message)
            dispatch({type: 'SET_LOADING', payload: false});
            dispatch(setAlertErrorMessage(error.message));
            dispatch(setAlertError(true))
        }
    
    }

    return <>
        <Controllers/>
        <Collapse in={alertOpen}>
            <Alert 
                severity="error"
                id="main-alert"
                action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                    dispatch(setAlertError(false));
                    }}>
                    <Close fontSize="inherit" />
                </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {alertMessage}
            </Alert>
        </Collapse>
        <CurrTable/>
        <WelcomeMessage/>
        <Dialog disableEscapeKeyDown open={editNewRowDialogOpen} maxWidth={false}>
                    <DialogTitle>Updating table with this values</DialogTitle>
                    <DialogContent >
                        <NewTable/>
                    </DialogContent>
                    
                    <DialogActions>
                        <Button onClick={()=>saveToDatabase()} variant="contained" color='secondary' disabled={editing}>
                            Save to DB
                        </Button>
                        <Button onClick={()=> {
                            dispatch(openNewRow(false));
                            dispatch(setEditMode(false));
                            // if more than 1 row => we are edditing new model, so when close set to default 
                            if(newTableRows.length > 1) {
                                setNewTableRowToDefault()
                            }
                            }}>
                                Close
                        </Button>
                        <Button onClick={()=> {
                            dispatch(openOnCellErrorMessage(true));
                            }}>
                                Show errors
                        </Button>
                    </DialogActions>
                </Dialog>
        {/* <Link to="/service">Service page</Link> */}
    </>
}