import { useSelector } from 'react-redux';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

export const Table = (props) => {
    const table = useSelector(state => state.table);
    const columns = useSelector(state => state.columns);
    const _columns = columns.map(elt => Object({key : elt, name : elt.charAt(0).toUpperCase()+elt.slice(1)}));
    console.log(table);
    // const pageSize = 5;
    // const paginationOptions = {
    //     enabled: true,
    //     pageSize: pageSize,
    //     mode: 'pagination',
    //     rowCount: table.length
    // };
    return <>
        <h1>Table component</h1>
        <div className='container'>
             <DataGrid 
                columns={_columns}
                rows={table}
                // pageSize={pageSize}
                // pagination
                // paginationOptions={paginationOptions}
            />
        </div>
    </>
}