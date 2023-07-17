import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridCellEditStopReasons, GridCellEditStartReasons, GridEditInputCell } from '@mui/x-data-grid';
import { setEditMode } from '../actions';
// import { validateCell } from './Validation';
import { makeStyles, styled } from '@mui/styles';
import {Box} from '@mui/material'

const validateCellFailed = (value) => {
    console.log('params.value =>', value)
    if (!value || value === "") {
        console.log('true')
      return true;
    } else {
        return false;
    }
}

const useStyles = makeStyles((theme) => {
console.log('theme', theme)
return (
    {
    root: {
      background: 'red',
      color: 'white',
    },
  })
}
);

const StyledBox = styled(Box)(({ theme }) => ({
    height: '100%',
    width: '100%',
    ':has(div.Mui-error)' : {
        backgroundColor: `rgba(126,10,15, 0.1)`,
        color:  '#ff4343',
      },
    '& .Mui-error': {
      backgroundColor: `rgba(126,10,15, 0.1)`,
      color:  '#ff4343',
    },
  }));


const StyledInput = (params) => {
    const classes = useStyles();
    const {error, ...other} = params;
    if (params.error) {
        console.log('error, classses',classes)
    }
    return (<GridEditInputCell {...other} className={error ? `${classes.root} Mui-error`: null}/>
    );
  };

function customRender (props) {
    console.log('props in render', props)
    // const {error, ...other} = props;
    return (<StyledInput {...props}/>);
  }



export const Table = (props) => {
    const dispatch = useDispatch()
    const table = useSelector(state => state.table);
    const primaryKey = useSelector(state => state.primaryKey);
    const selected_columns = useSelector(state => state.selected_columns);
    const editing = useSelector(state => state.editing);
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
    // console.log(lengths)
    columns = columns.map(elt => Object({
                field : elt[0],
                headerName : elt[0].charAt(0).toUpperCase() + elt[0].slice(1), 
                width : lengths.get(elt[0])*12+15, 
                editable : true, 
                preProcessEditCellProps : (params) => {
                    const hasError = validateCellFailed(params.props.value);
                    if(hasError) {
                        console.log('haserror params', { ...params.props, error: hasError })
                    }
                    return { ...params.props, error: hasError };
                  },
                renderEditCell : customRender
                
            })
        );
    

    const handleSave = (updRow) => {
        console.log(updRow);
        dispatch(setEditMode(false))
        ////
        /// to code checks and server update  
        ////
        return updRow
    }; 
  
    return <>
        <div className='container'>
            <h1>Table component</h1>
            <StyledBox>
             <DataGrid 
                columns={columns}
                rows={table}
                getRowId={row => row[primaryKey]}
                
                onCellEditStop={(params, event) => {
                    console.log(params)
                    if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                      event.defaultMuiPrevented = true;
                    }
                    // else if (!validateCell(params.value, params.field, params.rowData)) {
                    //     event.defaultMuiPrevented = true;
                    // }
                }}

                onCellEditStart={(params, event) => {
                    // console.log('reason of start', params.reason);
                    // console.log('event', event)
                    if (params.reason !== GridCellEditStartReasons.cellDoubleClick || editing) {
                        event.defaultMuiPrevented = true;
                    } else {
                        dispatch(setEditMode(true))
                    }
                }}

                processRowUpdate={(updatedRow, originalRow) => handleSave(updatedRow)}

            />
            </StyledBox>
        </div>
    </>
}