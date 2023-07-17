import { useSelector, useDispatch } from 'react-redux';
import {FormControl, InputLabel, MenuItem, Select, FormControlLabel, FormLabel, FormGroup, Checkbox, Button} from '@mui/material';
import { setTableName, toggleSelected } from '../actions';
import {useState} from 'react'
// import { Dialog } from './misc/Dialog';
import {Dialog , DialogActions, DialogContent, DialogTitle}from '@mui/material';
import './Controllers.css'

export const Controllers = (props) => {
    const table_name = useSelector(state => state.table_name);
    const tables = useSelector(state => state.tables);
    const selected_columns = useSelector(state => state.selected_columns);
    const editing = useSelector(state => state.editing);
    const [editColumns, openEditColumns] = useState(false);
    const dispatch = useDispatch();

    const handleChangeTable = (e) => {
        dispatch(setTableName(e.target.value));
    }

    const handleColumsCheck = (idx) => {
        dispatch(toggleSelected(idx))
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