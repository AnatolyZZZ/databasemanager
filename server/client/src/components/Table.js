import { useSelector } from 'react-redux';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

export const Table = (props) => {
    const table = useSelector(state => state.table);
    const columns = useSelector(state => state.columns);
    return <>
        <h1>Table component</h1>
        <p>{table?.map((elt, idx) => <span key={idx}>{JSON.stringify(elt)}    </span>)}</p>
        <p>{JSON.stringify(columns)}</p>
    </>
}