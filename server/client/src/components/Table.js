import { useSelector } from 'react-redux';
import { DataGrid, GridCellEditStopReasons, GridCellEditStartReasons } from '@mui/x-data-grid';

export const Table = (props) => {
    const table = useSelector(state => state.table);
    const primaryKey = useSelector(state => state.primaryKey);
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
    // console.log(lengths)
    columns = columns.map(elt => Object({field : elt[0], headerName : elt[0].charAt(0).toUpperCase()+elt[0].slice(1), width : lengths.get(elt[0])*12+5, editable : true}));
    

    const handleSave = (updRow) => {
        console.log(updRow)
        ////
        /// to  code checks and server update  
        ////
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
                    if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                      event.defaultMuiPrevented = true;
                    }  
                }}
                
                onCellEditStart={(params, event) => {
                    console.log('reason of start', params.reason)
                    if (params.reason !== GridCellEditStartReasons.cellDoubleClick) {
                        event.defaultMuiPrevented = true;
                    }
                }}

                processRowUpdate={(updatedRow, originalRow) => handleSave(updatedRow)}

            />
        </div>
    </>
}