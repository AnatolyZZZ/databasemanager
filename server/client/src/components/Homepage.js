import { CurrTable } from "./Currtable";
import { Controllers } from './Controllers'
import { NewTable } from "./Newtable";
import { setTable, setNewTableRows, openNewRow, setAlertErrorMessage, setAlertError, setEditMode, openOnCellErrorMessage} from '../actions'
import { Dialog , DialogActions, DialogContent, DialogTitle, Button} from '@mui/material';
import { useSelector, useDispatch } from "react-redux";


export const HomePage = (props) => {
    const dispatch = useDispatch();
    const newTableRows = useSelector(state => state.newTableRows);
    const cur_table = useSelector(state => state.table);
    const table_name = useSelector(state => state.table_name);
    const root_url = useSelector(state => state.root_url);
    const editable = useSelector(state => state.editable_columns);
    const editNewRowDialogOpen = useSelector(state => state.newRow);

    const saveOneRowToDatabase = async () => {
        /// we dont send to DB rows with id as it is probably PK
        const readyToUpd = [...newTableRows];
        for (let key in readyToUpd) {
   
            let newRowWithNoKey = {...readyToUpd[key]}
            // what if PK is not id?
            delete newRowWithNoKey.id
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
                const editRow = [{id : 1}];
                editable.forEach(elt => editRow[0][elt]='');
                dispatch(setNewTableRows(editRow));

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
        <CurrTable/>
        <Dialog disableEscapeKeyDown open={editNewRowDialogOpen} maxWidth={false}>
                    <DialogTitle>Fill new row</DialogTitle>
                    <DialogContent >
                        <NewTable/>
                    </DialogContent>
                    
                    <DialogActions>
                        <Button onClick={()=>saveOneRowToDatabase()} variant="contained" color='secondary'>
                            Save to DB
                        </Button>
                        <Button onClick={()=> {
                            dispatch(openNewRow(false));
                            dispatch(setEditMode(false));
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
    </>
}