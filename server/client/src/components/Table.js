import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridCellEditStopReasons, GridCellEditStartReasons, GridEditInputCell } from '@mui/x-data-grid';
import { setEditMode } from '../actions';
import { validateCellFailed } from './Validation';
import { makeStyles } from '@mui/styles';
import {useState} from 'react'



const useStyles = makeStyles((theme) => {
// console.log('theme', theme)
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
    if (params.error) {
        // console.log('error, classses',classes)
    }
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
    const root_url = useSelector(state => state.root_url);
    const editing = useSelector(state => state.editing);
    const constrains = useSelector(state => state.constrains);
    const [editingColumnName, setEditingColumnName] = useState(null);
    const lengths = new Map();
    let columns = selected_columns.filter(elt => elt[1] === true);


    for (let column of selected_columns) {
        lengths.set(column[0], String(column[0]).length);
    }
    // for each row for each column update max length in symbols
    for (let row of table) {
        for (let key in row) {
            lengths.set(key, Math.max(lengths.get(key), String(row[key]).length))
        }
    }
    const isSerial = (column) => {
        // console.log(constrains)
        const defaultValString = String(constrains[column]['defaultValue']);
        const nextVal = defaultValString.slice(0, 8);
        const res = nextVal === 'nextval(' ? true : false
        // console.log('nextVal', res)
        return res
    }
    // if (Object.keys(constrains).length > 0) {
    //     console.log('length', Object.keys(constrains).length)
    //     isSerial('id')
    // };

    // console.log(lengths)
    columns = columns.map(elt => Object({
                field : elt[0],
                headerName : elt[0].charAt(0).toUpperCase() + elt[0].slice(1), 
                width : lengths.get(elt[0])*12+15, 
                editable : !isSerial(elt[0]), 
                preProcessEditCellProps : (params) => {
                    const hasError = validateCellFailed(params, constrains[editingColumnName], dispatch);
                    // if(hasError) {
                        // console.log('param props', params.props)
                    // }
                    return { ...params.props, error: hasError };
                  },
                renderEditCell : customRender
                
            })
        );
    

    const handleSave = async (updRow) => {
        // console.log(updRow);
        dispatch({type: 'SET_LOADING', payload: true})
        ////
        /// to code checks and server update  
        ////
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

        try {
            const res = await fetch(`${root_url}/api/general/tables`, para);
            const result = await res.json()
            // console.log('result', result)
            if (res.status === 200) {
                const row = result[0]
                dispatch({type: 'SET_LOADING', payload: false});
                dispatch(setEditMode(false));
               return row
            } else {
                console.log('error', result.msg, 'result.upd', result.upd)
                return result.upd.entry 
            }
        } catch (error) {
            console.log('error => ', error)
        }
        return updRow
    }; 
  
    return <>
        <div className='container'>
            <h1>Table component</h1>
             <DataGrid 
                columns={columns}
                rows={table}
                getRowId={row => row[primaryKey]}
                
                onCellEditStop={(params, event) => {
                    // console.log(params)
                    if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                      event.defaultMuiPrevented = true;
                    } else {
                        dispatch(setEditMode(false))
                    }
                }}

                onCellEditStart={(params, event) => {
                    // console.log('params of start', params);
                    // console.log('check', params.reason !== GridCellEditStartReasons.cellDoubleClick &  params.reason !== editing &  params.reason !== GridCellEditStartReasons.enterKeyDown)
                    // console.log('left', params.reason);
                    // console.log('right',GridCellEditStartReasons.cellDoubleClick || editing || GridCellEditStartReasons.enterKeyDown)
                    // console.log(GridCellEditStartReasons.enterKeyDown)
                    if ((params.reason !== GridCellEditStartReasons.cellDoubleClick &  params.reason !== editing &  params.reason !== GridCellEditStartReasons.enterKeyDown)||(editing === true)) {
                        event.defaultMuiPrevented = true;
                    } else {
                        dispatch(setEditMode(true));
                        setEditingColumnName(params.field)
                    }
                }}

                processRowUpdate={async (updatedRow, originalRow) => handleSave(updatedRow)}
                onProcessRowUpdateError={(err)=> console.log('err', err)}

            />
        </div>
    </>
}