import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridCellEditStopReasons, GridCellEditStartReasons, GridEditInputCell } from '@mui/x-data-grid';
import { setEditMode } from '../actions';
import { validateCellFailed } from './Validation';
import { makeStyles } from '@mui/styles';
import { useState } from 'react'



const useStyles = makeStyles((theme) => {
return (
    {
    root: {
      background: 'rgba(255, 0, 0, 0.6);',
      color: 'white',
      height: '100%'
    },
  })
}
);

const StyledInput = (params) => {
    const classes = useStyles();
    const {error, ...other} = params;
    return (<GridEditInputCell {...other} className={error ? `${classes.root} Mui-error`: null}/>
    );
  };

function customRender (props) {
    return (<StyledInput {...props}/>);
  }

export const Table = (props) => {
    // console.log(props)
    const dispatch = useDispatch()
    const primaryKey = useSelector(state => state.primaryKey);
    const editing = useSelector(state => state.editing);
    const lengths = useSelector(state => state.lengths);
    const constrains = useSelector(state => state.constrains);
    // const loading = useSelector(state => state.loading);
    // console.log(loading)

    const [editingColumnName, setEditingColumnName] = useState(null);

    const makeColumns = (columns) => columns.map(elt => Object({
        field : elt,
        headerName : elt.charAt(0).toUpperCase() + elt.slice(1), 
        width : lengths.get(elt)*11+15, 
        editable : !isSerial(elt), 
        preProcessEditCellProps : (params) => {
            // console.log(constrains)
            // console.log('preproces', editingColumnName)
            /// should refactor this part
            const hasError = validateCellFailed(params, constrains[editingColumnName], dispatch);
            return { ...params.props, error: hasError };
          },
        renderEditCell : customRender
        
    }));

    function isSerial (column) {
        // serial columns are not editable 
        const defaultValString = String(constrains[column]['defaultValue']);
        const nextVal = defaultValString.slice(0, 8);
        return nextVal === 'nextval(' ? true : false
    }

    return <>
        <div className='container'>
                <DataGrid 
                    columns={makeColumns(props.columns)}
                    rows={props.rows}
                    getRowId={row => row[primaryKey]}
                    showCellVerticalBorder={props.showCellVerticalBorder}
                    showColumnVerticalBorder={props.showColumnVerticalBorder}
                    // loading={loading}
                    
                    onCellEditStop={(params, event) => {
                        // console.log(params)
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
        </div>
    </>
}