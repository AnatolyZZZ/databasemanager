import { useSelector, useDispatch } from 'react-redux';
import { CurrTable } from '../components/Currtable';
import { WelcomeMessage } from '../components/WelcomeMessage';
import { Controllers } from '../components/Controllers';
import { NewTable } from '../components/NewTable';
import {
  setTable, openNewRow, setEditMode, openOnCellErrorMessage, setNewTableToDefault,
} from '../actions';
import { MyAlert } from '../components/MyAlert';
import CustomModal from '../components/universal/CustomModal';
import { postData } from '../utils/api';
import { $loading } from '../utils/ux';

export function HomePage() {
  const dispatch = useDispatch();
  const newTableRows = useSelector((state) => state.newTableRows);
  const cur_table = useSelector((state) => state.table);
  const table_name = useSelector((state) => state.table_name);
  const editNewRowDialogOpen = useSelector((state) => state.newRow);
  const editing = useSelector((state) => state.editing);
  const errorsInNewTable = useSelector((state) => state.validationErrors);
  const constrains = useSelector((state) => state.constrains);
  const columns = useSelector((state) => state.columns);

  const isSerial = (column) => {
    const defaultValString = String(constrains[column].defaultValue);
    const nextVal = defaultValString.slice(0, 8);
    return nextVal === 'nextval(';
  };


  const saveToDatabase = async () => {
    $loading(true);
    // need to delete all Serial from table
    const seiralColumns =  columns.filter(column => isSerial(column))
    let prepareUpdate = [...newTableRows];
    prepareUpdate = prepareUpdate.map(row => {
      seiralColumns.forEach(column =>  delete row[column])
      return row
      })

    const addedRows = await postData('/api/table', { table: table_name, rows: prepareUpdate });
    if (addedRows) {
      const newTable = [...cur_table, ...addedRows];
      dispatch(setTable(newTable));
      // should clear everything in newTable
      dispatch(setNewTableToDefault());
      dispatch(openNewRow(false));
    }
    console.log('newTableRows ->',newTableRows);
    $loading(false);
  };

  const closeEditModal = () => {
    dispatch(openNewRow(false));
    dispatch(setEditMode(false));
    dispatch(setNewTableToDefault());
  };

  return (
    <>
      <MyAlert />
      <Controllers />
      <CurrTable />
      <WelcomeMessage />

      <CustomModal
        title="Updating table with this values"
        show={editNewRowDialogOpen}
        onSuccess={saveToDatabase}
        mainDisabled={editing || errorsInNewTable !== 0}
        success_text="Save to DB"
        onClose={closeEditModal}
        onSecondary={() => dispatch(openOnCellErrorMessage(true))}
        secondary_text="Show errors"
        mainButtonStyles={{ variant: 'outlined', color: 'secondary' }}
      >
        <NewTable />
      </CustomModal>
    </>
  );
}
