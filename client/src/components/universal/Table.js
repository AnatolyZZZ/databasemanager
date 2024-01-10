import { useSelector, useDispatch } from 'react-redux';
import {
  DataGrid, GridCellEditStopReasons, GridCellEditStartReasons, GridEditInputCell, useGridApiContext, GridCell
} from '@mui/x-data-grid';
import { Select, Switch, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { setEditMode } from '../../actions';
import { validateCellFailed } from '../Validation';

function CustomRenderEditCell(params) {
  const { error, ...other } = params;
  const { colDef } = params;
  const { type } = colDef;
  if (type === 'singleSelect') return (<EnumRender {...other} />);
  if (type === 'boolean') return (<BoolRender {...other}/>);
  return (<GridEditInputCell {...other} className={error ? 'cell-error' : null} />);
}

function EnumRender(props) {
  const apiRef = useGridApiContext();
  return (
    <Select
      native
      sx={{ width: '100%' }}
      value={props.value}
      onChange={(event) => {
        apiRef.current.setEditCellValue({ id: props.id, field: props.field, value: event.target.value })
      }}
    > 
      <option disabled key='some_unique_key_used_for_default' value=''>Choose ↓</option>
      {props.colDef.valueOptions.map((option, id) => <option key={option.value + id} value={option.value}>{option.label}</option>)}
    </Select>
  );
}

function BoolRender(props) {
  const apiRef = useGridApiContext();
  const [checked, setChecked] =  useState(props.value === '' ? false : props.value)
  useEffect(() => {
    if (props.value === '') {
      apiRef.current.setEditCellValue({ id: props.id, field: props.field, value: checked });
    }
  }, [apiRef, props.value, props.id, props.field]);
  return (
    <Stack direction="row" spacing={0} alignItems="center">
    <span style={{fontSize : 10, transform: 'translateX(2px)'}}>False</span>
    <Switch
      checked={checked}
      color={'success'}
      size='small'
      onChange={(event) => {
        setChecked(event.target.checked);
        apiRef.current.setEditCellValue({ id: props.id, field: props.field, value: event.target.checked})}}
    />
    <span style={{fontSize : 10, transform: 'translateX(-2px)'}}>True</span>
    </Stack>
  )
}

export function Table(props) {
  const dispatch = useDispatch();
  const primaryKey = useSelector((state) => state.primaryKey);
  const editing = useSelector((state) => state.editing);
  const lengths = useSelector((state) => state.lengths);
  const constrains = useSelector((state) => state.constrains);

  const [editingColumnName, setEditingColumnName] = useState(null);

  const checkUneditedCells = props.checkUnedited ? (params) => {
    const failed =  validateCellFailed(params, constrains[params.field], dispatch, false) 
    return failed ? 'cell_with-error' : null
  } : null

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
    renderEditCell: (params) => <CustomRenderEditCell {...params} />,
    // renderCell: (params) => <CustomRender {...params} />
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
      getCellClassName={checkUneditedCells}

      onCellEditStop={(params, event) => {
        if (params.reason === GridCellEditStopReasons.cellFocusOut) {
          event.defaultMuiPrevented = true;
        } else {
          // console.log('params ->',params);
          // console.log('event ->',event);
          dispatch(setEditMode(false));
        }
      }}

      onCellEditStart={(params, event) => {
        if ((params.reason !== GridCellEditStartReasons.cellDoubleClick & params.reason !== editing & params.reason !== GridCellEditStartReasons.enterKeyDown) || (editing === true)) {
          event.defaultMuiPrevented = true;
        } else {
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
