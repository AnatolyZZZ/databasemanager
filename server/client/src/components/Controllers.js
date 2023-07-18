import { useSelector, useDispatch } from 'react-redux';
import {FormControl, InputLabel, MenuItem, Select, FormControlLabel, FormGroup, Checkbox, Button} from '@mui/material';
import { setTableName, toggleSelected } from '../actions';
import {useState} from 'react'
import Paper from '@mui/material/Paper';
import {Dialog , DialogActions, DialogContent, DialogTitle}from '@mui/material';
import Draggable from 'react-draggable';
import './Controllers.css'


export const Controllers = (props) => {
    const table_name = useSelector(state => state.table_name);
    const tables = useSelector(state => state.tables);
    const selected_columns = useSelector(state => state.selected_columns);
    const editing = useSelector(state => state.editing);
    const errorMessage = useSelector(state => state.errorMessage);
    const [editColumns, openEditColumns] = useState(false);
    const [showErrorMessage, setShowMessage] = useState(false);
    const dispatch = useDispatch();

    const handleChangeTable = (e) => {
        dispatch(setTableName(e.target.value));
    }

    const handleColumsCheck = (idx) => {
        dispatch(toggleSelected(idx))
    }

    function PaperComponent(props) {
        return (
          <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
          >
            <Paper {...props} />
          </Draggable>
        );
      }

    return <div className="container controllers">
        <FormControl size='large' sx={{m: 1, width : 192}}>
        <InputLabel id="table_name_select_label">Table name</InputLabel>
            <Select
                labelId="table_name_select_label"
                id="table_name_select"
                value={table_name}
                label="Table name"
                onChange={handleChangeTable}
                disabled={editing}
            >   
                <MenuItem disabled value="">
                    <em>Select table name</em>
                 </MenuItem>
                {tables.map(elt => <MenuItem value={elt} key={elt}>{elt}</MenuItem>)}
            </Select>
    </FormControl>

    <Button variant="contained" color='secondary' onClick={(e) => {if (!editing) {openEditColumns(true)}}}>Select columns</Button>

    <Dialog disableEscapeKeyDown open={editColumns}>
        <DialogTitle>Which columns to display?</DialogTitle>

        <DialogContent>
            <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
                <FormGroup>
                    {selected_columns.map((elt, idx) => 
                        <FormControlLabel
                        key={idx}
                        control={
                        <Checkbox checked={elt[1]} onChange={(e) => handleColumsCheck(idx)} name={elt[0]} />
                        }
                        label={elt[0]}
                    />
                )}
                </FormGroup>
            </FormControl>
        </DialogContent>
        
        <DialogActions>
            <Button onClick={()=> openEditColumns(false)}>Ok</Button>
        </DialogActions>
    </Dialog>

    <Button variant='outlined' onClick={()=>setShowMessage(true)}>Show errors</Button>

    #draggable-dialog-title
    <Dialog open={showErrorMessage}> 
        <DialogTitle id="#draggable-dialog-title" style={{ cursor: 'move' }}>Error on currently editing sell:</DialogTitle>
        <DialogContent>
            {errorMessage ? errorMessage : 'No errors detected'}
        </DialogContent>

        <DialogActions>
            <Button onClick={()=> setShowMessage(false)}>Close</Button>
        </DialogActions>
    </Dialog>

    {/* <Dialog isOpen={editColumns} cssClass={'columns-edit'}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Which columns to display?</FormLabel>
        <FormGroup>
            {selected_columns.map((elt, idx) => 
                <FormControlLabel
                key={idx}
                control={
                  <Checkbox checked={elt[1]} onChange={(e) => handleColumsCheck(idx)} name={elt[0]} />
                }
                label={elt[0]}
              />
         )}
        </FormGroup>
      </FormControl>
      <Button onClick={()=>openEditColumns(false)}>Close</Button>
    </Dialog>  */}

    </div>
}