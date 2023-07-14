import { useSelector } from 'react-redux';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

export const Table = (props) => {
    const table = useSelector(state => state.table);
    const selected_columns = useSelector(state => state.selected_columns);
    const columns = selected_columns.filter(elt => elt[1] === true).map(elt => Object({key : elt[0], name : elt[0].charAt(0).toUpperCase()+elt[0].slice(1)}));
  
    return <>
        <div className='container'>
            <h1>Table component</h1>
             <DataGrid 
                columns={columns}
                rows={table}
            />
        </div>
    </>
}