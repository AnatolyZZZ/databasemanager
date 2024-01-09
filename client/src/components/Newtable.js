import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setNewTableRows } from '../actions';
import { Table } from './universal/Table';
import { $alert} from '../utils/ux';

export function NewTable(props) {
  const newTableRows = useSelector((state) => state.newTableRows);
  const columns = useSelector((state) => state.editable_columns);
  const primaryKey = useSelector((state) => state.primaryKey);

  const dispatch = useDispatch();

  const updateRows = async (updRow, originalRow) => {
    const newRowsState = [...newTableRows];

    const idx = newRowsState.findIndex((row) => row[primaryKey] === originalRow[primaryKey]);
    newRowsState[idx] = updRow;
    /// check that PK is still unique
    let i = 0;
    for (const row of newRowsState) {
      if (row[primaryKey] === updRow[primaryKey]) {
        i++;
      }
    }
    if (i > 1) {
      $alert(`PK ${updRow[primaryKey]} already exists`)
    } else {
      dispatch(setNewTableRows(newRowsState));
    }
    return updRow;
  };
  // probably don't need Box component, but keep if want to change some styles later
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      '       .MuiDataGrid-cell': {
        // make borders visible
        // border : '1px solid #f6f6f6'
      },
    }}
    >

      <Table
        columns={columns}
        rows={newTableRows}
        showColumnVerticalBorder
        showCellVerticalBorder
        handleSave={updateRows}
        checkUnedited
      />

    </Box>
  );
}
