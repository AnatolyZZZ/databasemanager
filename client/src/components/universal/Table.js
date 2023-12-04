import { useSelector, useDispatch } from 'react-redux';
import {
  DataGrid, GridCellEditStopReasons, GridCellEditStartReasons, GridEditInputCell, useGridApiContext,
} from '@mui/x-data-grid';
import { Select } from '@mui/material';
import { useState } from 'react';
import { setEditMode } from '../../actions';
import { validateCellFailed } from '../Validation';

function CustomRender(params) {
  const { error, ...other } = params;
  const { colDef } = params;
  const { type } = colDef;
  if (type === 'singleSelect') return (<EnumRender {...other} />);
  return (<GridEditInputCell {...other} className={error ? 'cell-error' : null} />);
}

function EnumRender(props) {
  const apiRef = useGridApiContext();
  return (
    <Select
      native
      sx={{ width: '100%' }}
      value={props.value}
      onChange={(event) => apiRef.current.setEditCellValue({ id: props.id, field: props.field, value: event.target.value })}
    >
      {props.colDef.valueOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </Select>
  );
}

export function Table(props) {
  const dispatch = useDispatch();
  const primaryKey = useSelector((state) => state.primaryKey);
  const editing = useSelector((state) => state.editing);
  const lengths = useSelector((state) => state.lengths);
  const constrains = useSelector((state) => state.constrains);

  const [editingColumnName, setEditingColumnName] = useState(null);

  const makeColumns = (columns) => columns.map((elt) => Object({
    field: elt,
    headerName: elt.charAt(0).toUpperCase() + elt.slice(1),
    width: lengths.get(elt) * 11 + 15,
    editable: !isSerial(elt),
    type: getCellType(elt),
    valueGetter: (params) => (params.value === null ? '' : params.value),
    valueOptions: constrains[elt].type === 'enum' ? constrains[elt].enumValues.map((elt) => ({ value: elt, label: elt })) : null,
    preProcessEditCellProps: (params) => {
      /// should refactor this part
      const hasError = validateCellFailed(params, constrains[editingColumnName], dispatch);
      return { ...params.props, error: hasError };
    },
    renderEditCell: (params) => <CustomRender {...params} />,

  }));

  function isSerial(column) {
    // serial columns are not editable
    const defaultValString = String(constrains[column].defaultValue);
    const nextVal = defaultValString.slice(0, 8);
    return nextVal === 'nextval(';
  }

  function getCellType(column) {
    const typesConvert = {
      boolean: 'boolean',
      integer: 'integer',
      'character varying': 'string',
      text: 'string',
      character: 'string',
      enum: 'singleSelect',
    };
    const result = typesConvert[constrains[column].type];
    return result || 'string';
  }

  return (
    <DataGrid
      columns={makeColumns(props.columns)}
      rows={props.rows}
      getRowId={(row) => row[primaryKey]}
      showCellVerticalBorder={props.showCellVerticalBorder}
      showColumnVerticalBorder={props.showColumnVerticalBorder}

      onCellEditStop={(params, event) => {
        console.log('edit stop', params);
        if (params.reason === GridCellEditStopReasons.cellFocusOut) {
          event.defaultMuiPrevented = true;
        } else {
          dispatch(setEditMode(false));
        }
      }}

      onCellEditStart={(params, event) => {
        if ((params.reason !== GridCellEditStartReasons.cellDoubleClick & params.reason !== editing & params.reason !== GridCellEditStartReasons.enterKeyDown) || (editing === true)) {
          event.defaultMuiPrevented = true;
        } else {
          // console.log(params)
          dispatch(setEditMode(true));
          setEditingColumnName(params.field);
        }
      }}

      processRowUpdate={async (updatedRow, originalRow) => props.handleSave(updatedRow, originalRow)}
      // eslint-disable-next-line
      onProcessRowUpdateError={(err) => console.log('err in processRowUpdate', err)}

      id="data-grid-main"
    />
  );
}
