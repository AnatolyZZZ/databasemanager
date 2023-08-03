import { useSelector, useDispatch } from 'react-redux';
import { setEditMode, setAlertError, setAlertErrorMessage } from '../actions';
import { Box } from '@mui/material';
import { Table } from './Table';
import { useState, useEffect } from 'react';


export const CurrTable = (props) => {
    const dispatch = useDispatch()
    const table = useSelector(state => state.table);
    const table_name = useSelector(state => state.table_name);
    const primaryKey = useSelector(state => state.primaryKey);
    const selected_columns = useSelector(state => state.selected_columns);
    const root_url = useSelector(state => state.root_url);
    const filters = useSelector(state => state.filters);
    const apply_filters = useSelector(state => state.apply_filters);
    const [filteredRows, filterRows] = useState([...table]);
    console.log('filtered', filteredRows);

    const applyFilter = (idx, arr) => {
        const curFilter = filters[table_name][idx];
        console.log('applying filter', curFilter)
        switch (curFilter.operand) {
            case ('=') :
                arr = arr.filter(elt => elt[curFilter.column_name] == curFilter.value);
                break;
            case ('<') :
                arr = arr.filter(elt => elt[curFilter.column_name] < curFilter.value);
                break;
            case ('>') :
                arr = arr.filter(elt => elt[curFilter.column_name] > curFilter.value);
                break;
            case ('<=') :
                arr = arr.filter(elt => elt[curFilter.column_name] <= curFilter.value);
                break;
            case ('>=') :
                arr = arr.filter(elt => elt[curFilter.column_name] >= curFilter.value);
                break;
        }
        if (idx === 0) {
            console.log(arr)
            return arr
        } else 
            return applyFilter(idx - 1, arr)
    }

    useEffect(()=>{
        if (!apply_filters || !filters[table_name]) {
            console.log('switch app filters to', apply_filters)
            filterRows([...table]);
        } else {
            console.log(filters)
            filterRows(applyFilter(filters[table_name].length - 1, table))
        }
    }, [filters, apply_filters, table])

    const filteredColumns = selected_columns.filter(elt => elt[1] === true).map(elt =>elt[0]);
    
    // saves updated value of cell to database
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
        // dont fetch database if nothing have changed
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
                    // console.log('error', result.msg, 'result.upd', result.upd);
                    dispatch(setAlertErrorMessage(`Failed to save in database\n ${result.msg}`));
                    dispatch(setAlertError(true))
                    return result.upd.entry 
                }
            } catch (error) {
                console.log('error => ', error)
                dispatch(setAlertErrorMessage('Failed to save in database, unknown error '));
                dispatch(setAlertError(true))
                return originalRow
            }
        }
        // probably will never come here as we return erlier
        dispatch(setEditMode(false));
        return updRow
    }; 

    return <>
        <div className='container'>
            {table_name !=='' &&<h1>This is table "{table_name}"{apply_filters ? " filters applyed" : ' filters are NOT applyed'}</h1>}
            <Box sx={{
                width : '100%',
                height : '100%',
                // make all cells bright
                '.MuiDataGrid-cell' : {
                    opacity : 0.5
                },
                // then make editable solid again
                '.MuiDataGrid-cell--editable' :{
                    opacity : "1 !important",
                },
                '.MuiDataGrid-root' : {
                    'minHeight' : "400px"
                }
            }} id="style-box">
                <Table 
                    columns={filteredColumns} 
                    rows={filteredRows} 
                    handleSave={handleSave}
                    showColumnVerticalBorder={false}
                    showCellVerticalBorder={false}/>
            </Box>
        </div>
    </>
}