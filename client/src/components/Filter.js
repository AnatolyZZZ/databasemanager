import { Select, FormControl, InputLabel, MenuItem, TextField, Stack } from "@mui/material";
import { modifyFilter, delFilter} from '../actions';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';

export const Filter = (props) => {
    const columns = useSelector(state => state.columns);
    // console.log(columns);
    const filters = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const operands = ['=', '>', '<', '>=', '<='];

    const handleColumnChange = (e) => {
        const curFilter = filters[props.table][props.id];
        dispatch(modifyFilter(props.table, props.id, {...curFilter, column_name : e.target.value}))
    }

    const handleOperandChange = (e) => {
        const curFilter = filters[props.table][props.id];
        dispatch(modifyFilter(props.table, props.id, {...curFilter, operand : e.target.value}))
    }

    const handleValueChange = (e) => {
        const curFilter = filters[props.table][props.id];
        dispatch(modifyFilter(props.table, props.id, {...curFilter, value : e.target.value}))
    }

return <Stack direction='row' alignItems="center" spacing={1}>
<FormControl size='large' sx={{m: 1, width : 192}}>
    <InputLabel id={`filter_${props.id}_column_select_label`}>Column</InputLabel>
        <Select
            labelId={`filter_${props.id}_column_select_label`}
            id={`filter_${props.id}_column_select`}
            value={filters[props.table][props.id].column_name}
            label="Column"
            onChange={handleColumnChange}
        >   
            <MenuItem disabled value="">
                <em>Column name</em>
            </MenuItem>
            {columns.map(elt => <MenuItem value={elt} key={elt}>{elt}</MenuItem>)}
        </Select>
</FormControl>

<FormControl size='large' sx={{m: 1, width : 70}}>
    <InputLabel id={`filter_${props.id}_operand_select_label`}>Op</InputLabel>
        <Select
            labelId={`filter_${props.id}_operand_select_label`}
            id={`filter_${props.id}_operand_select`}
            value={filters[props.table][props.id].operand}
            label="Operand"
            onChange={handleOperandChange}
        >   
            <MenuItem disabled value="">
                <em>Operand</em>
            </MenuItem>
            {operands.map(elt => <MenuItem value={elt} key={elt}>{elt}</MenuItem>)}
        </Select>
</FormControl>

<TextField
    variant="outlined"
    value={filters[props.table][props.id].value}
    onChange={handleValueChange}/>
<DeleteIcon color="error" onClick={() => dispatch(delFilter(props.table, props.id))}/>
</Stack>
}