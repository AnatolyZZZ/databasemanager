import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridCellEditStopReasons, GridCellEditStartReasons, GridEditInputCell } from '@mui/x-data-grid';
import { Select, MenuItem } from '@mui/material';
import { setEditMode } from '../actions';
import { validateCellFailed } from './Validation';
import { useEffect, useState } from 'react'


const CustomRender = (params) => {
    const { error, ...other } = params;
    const { colDef } = params;
    const { type } = colDef 
    if (type === 'singleSelect') return (<EnumRender {...other}/>)
    return (<GridEditInputCell {...other} className={error ? `cell-error`: null}/>);
  };


function EnumRender (props) {
    console.log(props)
    return (<Select
                native
                value={props.value}
                onChange={async (event) => {
                    const initialRowValue = props.row;
                    const updatedRowValue = {...initialRowValue};
                    updatedRowValue[props.field] = event.target.value;
                    const res =  await props.handleSave(updatedRowValue, initialRowValue);
                    const rowsClone = [...props.rows]
                    const idx = rowsClone.findIndex(elt => elt[props.pk] === res[props.pk]);
                    rowsClone[idx]= res;
                    props.setRows(rowsClone);
                    setTimeout(()=> props.showRows(), 1000)
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      props.api.stopCellEditMode({id : props.id, field : props.field})
                    }
                  }}
            >
                {props.colDef.valueOptions.map((option) => <option key={option.value}v alue={option.value}>{option.label}</option>)}
            </Select>)
}

export const Table = (props) => {
    const dispatch = useDispatch()
    const primaryKey = useSelector(state => state.primaryKey);
    const editing = useSelector(state => state.editing);
    const lengths = useSelector(state => state.lengths);
    const constrains = useSelector(state => state.constrains);

    const [editingColumnName, setEditingColumnName] = useState(null);
    const [rows, setRows] = useState(props.rows)

    const showRows = () => {
        console.log('rows now', rows);
    }

    const makeColumns = (columns) => columns.map(elt => Object({
        field : elt,
        headerName : elt.charAt(0).toUpperCase() + elt.slice(1), 
        width : lengths.get(elt)*11+15, 
        editable : !isSerial(elt),
        type : getCellType(elt),
        valueGetter : (params) => params.value === null ? '' :  params.value,
        valueOptions : constrains[elt].type === 'Enum' ? constrains[elt].EnumValues.map(elt => ({value : elt, label : elt})) : null,
        preProcessEditCellProps : (params) => {
            /// should refactor this part
            const hasError = validateCellFailed(params, constrains[editingColumnName], dispatch);
            return { ...params.props, error: hasError };
          },
        renderEditCell : (params) => <CustomRender {...params} handleSave={props.handleSave} rows={rows} setRows={setRows} pk={primaryKey} showRows={showRows}/> ,
        
    }));

    useEffect(()=> {setRows(props.rows)}, [props.rows])

    function isSerial (column) {
        // serial columns are not editable 
        const defaultValString = String(constrains[column]['defaultValue']);
        const nextVal = defaultValString.slice(0, 8);
        return nextVal === 'nextval(' ? true : false
    }

    function getCellType(column) {
        const  typesConvert = 
        {   
            'boolean' : 'boolean',
            'integer' : 'integer',
            'character varying' : 'string',
            'text' : 'string',
            'character' : 'string',
            'Enum': 'singleSelect',
        }
        const result = typesConvert[constrains[column].type];
        return  result ? result : 'string'
    }

    return <>
        
                <DataGrid 
                    columns={makeColumns(props.columns)}
                    rows={rows}
                    getRowId={row => row[primaryKey]}
                    showCellVerticalBorder={props.showCellVerticalBorder}
                    showColumnVerticalBorder={props.showColumnVerticalBorder}
                    
                    onCellEditStop={(params, event) => {
                        console.log('edit stop', params)
                        if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                        event.defaultMuiPrevented = true;
                        }
                         else {
                                dispatch(setEditMode(false))
                            }
                    }}

                    onCellEditStart={(params, event) => {
                        if ((params.reason !== GridCellEditStartReasons.cellDoubleClick &  params.reason !== editing &  params.reason !== GridCellEditStartReasons.enterKeyDown)||(editing === true)) {
                            event.defaultMuiPrevented = true;
                        } else {
                            // console.log(params)
                            dispatch(setEditMode(true));
                            setEditingColumnName(params.field)
                        }
                    }}

                    processRowUpdate={async (updatedRow, originalRow) => props.handleSave(updatedRow, originalRow)}
                    onProcessRowUpdateError={(err)=> console.log('err in processRowUpdate', err)}

                    id="data-grid-main"
                />
      
    </>
}