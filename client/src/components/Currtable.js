import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { setEditMode } from '../actions';
import { Table } from './universal/Table';
import { $loading } from '../utils/ux';
import { postData } from '../utils/api';

export function CurrTable() {
  const dispatch = useDispatch();
  const table = useSelector((state) => state.table);
  const table_name = useSelector((state) => state.table_name);
  const primaryKey = useSelector((state) => state.primaryKey);
  const selected_columns = useSelector((state) => state.selected_columns);
  const filters = useSelector((state) => state.filters);
  const apply_filters = useSelector((state) => state.apply_filters);
  const [filteredRows, filterRows] = useState([...table]);

  useEffect(() => {
    const applyFilter = (idx, arr) => {
      const curFilter = filters[table_name][idx];
      let newArr;
      switch (curFilter.operand) {
        case ('='):
          newArr = arr.filter((elt) => String(elt[curFilter.column_name]) === String(curFilter.value));
          break;
        case ('<'):
          newArr = arr.filter((elt) => elt[curFilter.column_name] < curFilter.value);
          break;
        case ('>'):
          newArr = arr.filter((elt) => elt[curFilter.column_name] > curFilter.value);
          break;
        case ('<='):
          newArr = arr.filter((elt) => elt[curFilter.column_name] <= curFilter.value);
          break;
        case ('>='):
          newArr = arr.filter((elt) => elt[curFilter.column_name] >= curFilter.value);
          break;
        default:
          newArr = arr;
      }
      if (idx === 0) {
        return arr;
      }
      return applyFilter(idx - 1, newArr);
    };
    /// if filters are not applid or there is no setup filters for this table
    if (!apply_filters || !filters[table_name]) {
      filterRows([...table]);
      // otherwise should upply them
    } else {
      filterRows(applyFilter(filters[table_name].length - 1, table));
    }
  }, [filters, apply_filters, table, table_name]);

  const filteredColumns = selected_columns.filter((elt) => elt[1] === true).map((elt) => elt[0]);

  // saves updated value of cell to database
  const handleSave = async (updRow, originalRow) => {
    const upd = {
      tableName: table_name,
      primaryKey,
      keyValue: updRow[primaryKey],
      entry: updRow,
    };

    let shalowEqual = true;
    // numbers can be represented in strings
    // eslint-disable-next-line
    Object.keys(updRow).forEach((key) => { if (updRow[key] != originalRow[key]) shalowEqual = false; });
    // dont fetch database if nothing have changed
    if (!shalowEqual) {
      $loading(true);
      const result = await postData('/api/table', upd, {}, { signal: null }, 'Failed to save in database, unknown error', null, true);
      $loading(false);
      if (!result) return originalRow;
      const row = result[0];
      dispatch(setEditMode(false));
      return row;
    }
    return updRow;
  };

  return (
    <div className="container">
      {table_name !== '' && (
      <h1>
        This is table &quot;
        {table_name}
        &quot;.
        {apply_filters ? ' Filters applied' : ' Filters are NOT applied'}
      </h1>
      )}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          // make all cells bright
          '.MuiDataGrid-cell': {
            opacity: 0.5,
          },
          // then make editable solid again
          '.MuiDataGrid-cell--editable': {
            opacity: '1 !important',
          },
          '.MuiDataGrid-root': {
            minHeight: '400px',
          },
        }}
        id="style-box"
      >
        <Table
          columns={filteredColumns}
          rows={filteredRows}
          handleSave={handleSave}
          showColumnVerticalBorder={false}
          showCellVerticalBorder={false}
        />
      </Box>
    </div>
  );
}
