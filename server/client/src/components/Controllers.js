import { useSelector, useDispatch } from 'react-redux';
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import { setTableName } from '../actions';

export const Controllers = (props) => {
    const table_name = useSelector(state => state.table_name);
    const tables = useSelector(state => state.tables);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        dispatch(setTableName(e.target.value));
    }

    // console.log(tables);


    return <div className="container controllers">
        <FormControl size='large'>
        <InputLabel id="demo-simple-select-label">Select table name</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={table_name}
                label="Select table name"
                onChange={handleChange}
                style={{width : '12rem'}}
            >   
                {/* <MenuItem value="">Table name</MenuItem> */}
                {tables.map(elt => <MenuItem value={elt} key={elt}>{elt}</MenuItem>)}
            </Select>
    </FormControl>

    </div>
}