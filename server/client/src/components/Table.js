import { useSelector } from 'react-redux';
import 'react-data-grid/lib/styles.css';
// import DataGrid from 'react-data-grid';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';

export const Table = (props) => {
    const table = useSelector(state => state.table);
    const selected_columns = useSelector(state => state.selected_columns);
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
    console.log(lengths)
    columns = columns.map(elt => Object({field : elt[0], headerName : elt[0].charAt(0).toUpperCase()+elt[0].slice(1), width : lengths.get(elt[0])*12+5, editable : true}));
    

    const handleDoubleClick = (params, event) => {
        console.log(params, event)
        const rowID = params.id;
        const fieldName = params.field;
        const cellValue = params.row[fieldName];
        console.log('Double Clicked\n Cell Value:', cellValue, '\nfieldName:', fieldName, '\nrowID', rowID);
    };

    function rowKeyGetter(row) {
        console.log('row.id', row.id)
        return row.id;
      }
      
    
  
    return <>
        <div className='container'>
            <h1>Table component</h1>
             <DataGrid 
                columns={columns}
                rows={table}
                onCellSelected={(params, event) => handleDoubleClick(params, event)}
                rowKeyGetter={rowKeyGetter}
                onCellEditStop={(params, event) => {
                    if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                      event.defaultMuiPrevented = true;
                    }
                    handleDoubleClick(params, event)
                }}
            />
        </div>
    </>
}