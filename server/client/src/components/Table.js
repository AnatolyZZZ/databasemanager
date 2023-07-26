import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridCellEditStopReasons, GridCellEditStartReasons, GridEditInputCell } from '@mui/x-data-grid';
import { setEditMode, setAlertError, setAlertErrorMessage, openNewRow, openOnCellErrorMessage, setTable } from '../actions';
import { validateCellFailed } from './Validation';
import { makeStyles } from '@mui/styles';
import {useState, useEffect} from 'react'
import {Dialog , DialogActions, DialogContent, DialogTitle, Button}from '@mui/material';
import {Box} from '@mui/material'



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
    // console.log('props in render', props)
    // const {error, ...other} = props;
    return (<StyledInput {...props}/>);
  }

export const Table = (props) => {
    const dispatch = useDispatch()
    const table = useSelector(state => state.table);
    const table_name = useSelector(state => state.table_name);
    const primaryKey = useSelector(state => state.primaryKey);
    const selected_columns = useSelector(state => state.selected_columns);
    // console.log(selected_columns)
    const allColumns = useSelector(state => state.columns)
    const root_url = useSelector(state => state.root_url);
    const editing = useSelector(state => state.editing);
    const constrains = useSelector(state => state.constrains);
    const newDataDialogOpen = useSelector(state => state.newRow);
    const [editingColumnName, setEditingColumnName] = useState(null);
    /// this is for creating new item 
    const [newRowColumns, setNewRowColumns] = useState([])
    const [edit_row, setEditRow] = useState([]);
    const lengths = new Map();
    const filteredColumns = selected_columns.filter(elt => elt[1] === true);
    
    
    /// calculate width of every column

    // first set width of every header  
    for (let column of selected_columns) {
        lengths.set(column[0], String(column[0]).length);
    }
    // for each row for each column update max length in symbols
    for (let row of table) {
        for (let key in row) {
            lengths.set(key, Math.max(lengths.get(key), String(row[key]).length))
        }
    }
    // later can use it for columns but it is in symbols! 


    // function to create propper columns
    const makeColumns = (columns) => columns.map(elt => Object({
        field : elt[0],
        headerName : elt[0].charAt(0).toUpperCase() + elt[0].slice(1), 
        width : lengths.get(elt[0])*12+15, 
        editable : !isSerial(elt[0]), 
        preProcessEditCellProps : (params) => {
            /// can find cur cell field by working with params.otherFieldProps (find one is not in keys)
            /// => pass relevant constrains
            // maybe set errorMessage to [] if this is first in params.row but objects dont have to keep order?


            /// should refactor this part
            const hasError = validateCellFailed(params, constrains[editingColumnName], dispatch);
            return { ...params.props, error: hasError };
          },
        renderEditCell : customRender
        
    }));
    /// creating columns for new data table 
    useEffect(()=>{
         setNewRowColumns( makeColumns(allColumns.map(elt => [elt, true])) );
    },[allColumns])
    

    /// creating for main table
    let columns = makeColumns(filteredColumns);


    useEffect(()=>{
        // console.log('table_name', table_name)
        // console.log('newRowColumns', newRowColumns)
        const _edit_row = [{id : 1}]
        newRowColumns.forEach(element => {
            _edit_row[0][element.field] = ''
        });
    // console.log('edit row when created', _edit_row)
    setEditRow(_edit_row);
    },[table_name, newRowColumns]);

    useEffect(()=>{
        
    },[selected_columns])

    

    function isSerial (column) {
        // console.log(constrains)
        // console.log(column)
        const defaultValString = String(constrains[column]['defaultValue']);
        const nextVal = defaultValString.slice(0, 8);
        const res = nextVal === 'nextval(' ? true : false
        // console.log('nextVal', res)
        return res
    }
    

    
    const columnsEdit = makeColumns(selected_columns).filter(elt => elt.editable);


    const handleSave = async (updRow, originalRow) => {
       
        const upd = {
            tableName : table_name,
            primaryKey : primaryKey,
            keyValue : updRow[primaryKey],
            entry : updRow
        }

        const para = {
            method : "PUT",
            headers : {'Content-type' : 'application/json'},
            body : JSON.stringify(upd)
        }
        let shalowEqual = true;
        for (let key in updRow) {
            if (updRow[key] !== originalRow[key]) {
                shalowEqual = false
                break
            }
        }
        if (!shalowEqual) {
            try {
                dispatch({type: 'SET_LOADING', payload: true})
                const res = await fetch(`${root_url}/api/table`, para);
                const result = await res.json()
                // console.log('result', result)
                if (res.status === 200) {
                    const row = result[0]
                    dispatch({type: 'SET_LOADING', payload: false});
                    dispatch(setEditMode(false));
                return row
                } else {
                    console.log('error', result.msg, 'result.upd', result.upd);
                    dispatch(setAlertErrorMessage('Failed to save in database, res status'));
                    dispatch(setAlertError(true))
                    return result.upd.entry 
                }
            } catch (error) {
                console.log('error => ', error)
                dispatch(setAlertErrorMessage('Failed to save in database, err'));
                dispatch(setAlertError(true))
                return originalRow
            }
        }
        dispatch(setEditMode(false));
        return updRow
    }; 

    const saveNewRowToDatabase = async () => {
        const readyToUpd =  {...edit_row[0]};
        delete readyToUpd.id;
   
        const para = {
            method : 'POST',
            headers : {'Content-type' : 'application/json'},
            body : JSON.stringify(
                {
                    table : table_name,
                    rows : [readyToUpd]
                }
            )
        }
        
        try {
            dispatch({type: 'SET_LOADING', payload: true})
            const res = await fetch(`${root_url}/api/table`, para);
            if (res.status === 200) {
                // console.log(res);
                const _edit_row = [{id : 1}]
                newRowColumns.forEach(element => {
                _edit_row[0][element.field] = ''
                setEditRow(_edit_row);
                });
                const body = await res.json()
                // console.log('res body',body);
                const newTable = [...table];
                for (let row of body) {
                    newTable.push(row);
                }
                
                // console.log('newTable',newTable)
                dispatch(setTable(newTable));
                dispatch({type: 'SET_LOADING', payload: false})
            } else {
                const body = await res.json()
                // console.log('res body.msg',body.msg);
                throw new Error(body.msg)
            }
        } catch (error) {
            console.log('err message',error.message)
            dispatch({type: 'SET_LOADING', payload: false});
            dispatch(setAlertErrorMessage(error.message));
            dispatch(setAlertError(true))
        }
    
    }

    const saveNew = async (updRow, originalRow) => {   
        setEditRow([{...updRow}]);
        return updRow
    }

  
    return <>
        <div className='container'>
            <h1>Table component</h1>
            <Box sx={{
                width : '100%',
                height : '100%',
                '.MuiDataGrid-cell' : {
                    opacity : 0.5
                },
                '.MuiDataGrid-cell--editable' :{
                    opacity : "1 !important",
                },
                '.MuiDataGrid-root' : {
                    'minHeight' : "400px"
                }
            }} id="style-box">
                <DataGrid 
                    columns={columns}
                    rows={table}
                    getRowId={row => row[primaryKey]}
                    
                    onCellEditStop={(params, event) => {
                        // console.log(params)
                        if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                        event.defaultMuiPrevented = true;
                        }
                         else if (params.reason === GridCellEditStopReasons.escapeKeyDown) {
                                dispatch(setEditMode(false))
                            }
                    }}

                    onCellEditStart={(params, event) => {
                        if ((params.reason !== GridCellEditStartReasons.cellDoubleClick &  params.reason !== editing &  params.reason !== GridCellEditStartReasons.enterKeyDown)||(editing === true)) {
                            event.defaultMuiPrevented = true;
                        } else {
                            dispatch(setEditMode(true));
                            setEditingColumnName(params.field)
                        }
                        // dispatch({type : ACTIONS.SET_EDIT_ERROR_MESSAGES, payload : []})
                    }}

                    processRowUpdate={async (updatedRow, originalRow) => handleSave(updatedRow, originalRow)}
                    onProcessRowUpdateError={(err)=> console.log('err', err)}

                    id="data-grid-main"
                />
                <Dialog disableEscapeKeyDown open={newDataDialogOpen} maxWidth={false}>
                    <DialogTitle>Fill new row</DialogTitle>
                    <DialogContent >
                        <Box sx={{
                            width : '100%',
                            height : '100%',
                    '       .MuiDataGrid-cell' : {
                            border : '1px solid #f6f6f6'
                            }}}>
                                <DataGrid
                                    columns={columnsEdit}
                                    rows={edit_row}
                                    hideBorders={false}
                                    // editMode="row"
                                    onCellEditStart={(params, event) => {
                                        if(editing) {
                                            event.defaultMuiPrevented = true;
                                        } else {
                                            dispatch(setEditMode(true));
                                            setEditingColumnName(params.field);
                                        }
                                    }}
                                    processRowUpdate={async (updatedRow, originalRow) => saveNew(updatedRow, originalRow)}
                                    onProcessRowUpdateError = {error => console.log('error saving', error)}
                                    onCellEditStop={(params, event) => {
                                        // console.log(params)
                                        if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                                        event.defaultMuiPrevented = true;
                                        } else {
                                            dispatch(setEditMode(false))
                                        }
                                    }}
                                />
                        </Box>
                    </DialogContent>
                    
                    <DialogActions>
                        <Button onClick={()=>saveNewRowToDatabase()} variant="contained" color='secondary'>
                            Save to DB
                        </Button>
                        <Button onClick={()=> {
                            dispatch(openNewRow(false));
                            dispatch(setEditMode(false));
                            }}>
                                Close
                        </Button>
                        <Button onClick={()=> {
                            dispatch(openOnCellErrorMessage(true));
                            }}>
                                Show errors
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    </>
}