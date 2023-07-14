import { useSelector, useDispatch } from 'react-redux';
import {FormControl, InputLabel, MenuItem, Select, FormControlLabel, FormLabel, FormGroup, Checkbox} from '@mui/material';
import { setTableName, toggleSelected } from '../actions';

export const Controllers = (props) => {
    const table_name = useSelector(state => state.table_name);
    const tables = useSelector(state => state.tables);
    const selected_columns = useSelector(state => state.selected_columns)
    const dispatch = useDispatch();

    const handleChangeTable = (e) => {
        dispatch(setTableName(e.target.value));
    }

    const handleColumsCheck = (idx) => {
        dispatch(toggleSelected(idx))
    }

    // console.log(selected_columns);
    // console.log(tables)


    return <div className="container controllers">
        <FormControl size='large' sx={{m: 1, width : 192}}>
        <InputLabel id="table_name_select_label">Table name</InputLabel>
            <Select
                labelId="table_name_select_label"
                id="table_name_select"
                value={table_name}
                label="Table name"
                onChange={handleChangeTable}
                
            >   
                <MenuItem disabled value="">
                    <em>Select table name</em>
                 </MenuItem>
                {/* <MenuItem value="">Table name</MenuItem> */}
                {tables.map(elt => <MenuItem value={elt} key={elt}>{elt}</MenuItem>)}
            </Select>
    </FormControl>

    {/* <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="column_checkbox_label">Tag</InputLabel>
        <Select
          labelId="column_checkbox_label"
          id="column_checkbox"
          multiple
          value={'Columns'}
          onChange={handleColumsCheck}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}

      
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Which columns to display</FormLabel>
        <FormGroup>
            {selected_columns.map((elt, idx) => 
                <FormControlLabel
                control={
                  <Checkbox checked={elt[1]} onChange={(e) => handleColumsCheck(idx)} name={elt[0]} />
                }
                label={elt[0]}
              />
         )}
        </FormGroup>
        {/* <FormHelperText>Be careful</FormHelperText> */}
      </FormControl>
      

    </div>
}