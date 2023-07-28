import { Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { setNewTableRows } from '../actions';
import { Table } from './Table';

export const NewTable = (props) => {
    const newTableRows = useSelector(state => state.newTableRows);
    const columns = useSelector(state => state.editable_columns);

    const dispatch = useDispatch();

    const updateRows = async (updRow, originalRow) => {
        const newRowsState = [...newTableRows];

        // what if PK is not id? ??????
        const idx = newRowsState.findIndex(row => row.id === updRow.id);
        newRowsState[idx] = updRow;
        dispatch(setNewTableRows(newRowsState));
        return updRow
    }

    return <Box sx={{
            width : '100%',
            height : '100%',
    '       .MuiDataGrid-cell' : {
            // make borders visible
            border : '1px solid #f6f6f6'
            }}}>
            
                <Table columns={columns} rows={newTableRows} handleSave={updateRows} />
                
            </Box>
    }