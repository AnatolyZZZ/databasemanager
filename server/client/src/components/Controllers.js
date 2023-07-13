import { useSelector, useDispatch } from 'react-redux';
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import { setTableName } from '../actions';

export const Controllers = (props) => {
    const table_name = useSelector(state => state.table_name);
    const 
    const dispatch = useDispatch();

    const handleChange = (e) => {
        dispatch(setTableName(e.target.value));
    }


    return <div className="container controllers">
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={table_name}
                label="Select table name"
                onChange={handleChange}
            >
                {}
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
    </FormControl>

    </div>
}