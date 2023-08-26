import { Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { setAlertError, setAlertErrorMessage, setNewTableRows } from '../actions';
import { Table } from './Table';

export const NewTable = (props) => {
    const newTableRows = useSelector(state => state.newTableRows);
    const columns = useSelector(state => state.editable_columns);
    const primaryKey = useSelector(state => state.primaryKey)

    const dispatch = useDispatch();

    const updateRows = async (updRow, originalRow) => {
        const newRowsState = [...newTableRows];

        const idx = newRowsState.findIndex(row => row[primaryKey] === originalRow[primaryKey]);
        newRowsState[idx] = updRow;
        console.log(newRowsState)
         /// check that PK is still unique
         let i = 0;
         for (let row of newRowsState) {
             if (row[primaryKey] === updRow[primaryKey]) {
                i++;
             }
         }
         console.log('i', i)
         if (i > 1) {
            dispatch(setAlertErrorMessage(`PK ${updRow[primaryKey]} already exists`));
            dispatch(setAlertError(true));
         } else {
            dispatch(setNewTableRows(newRowsState));
         }
        return updRow
    }
    // probably don't need Box component, but keep if want to change some styles later
    return <Box sx={{
            width : '100%',
            height : '100%',
    '       .MuiDataGrid-cell' : {
            // make borders visible
            // border : '1px solid #f6f6f6'
            }}}>
            
                <Table 
                    columns={columns} 
                    rows={newTableRows} 
                    showColumnVerticalBorder={true}
                    showCellVerticalBorder={true}
                    handleSave={updateRows} />
                
            </Box>
    }