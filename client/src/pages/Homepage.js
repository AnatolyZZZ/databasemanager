import { useSelector, useDispatch } from 'react-redux';
import { CurrTable } from '../components/Currtable';
import { WelcomeMessage } from '../components/WelcomeMessage';
import { Controllers } from '../components/Controllers';
import { NewTable } from '../components/NewTable';
import { setTable, openNewRow, setEditMode, openOnCellErrorMessage, setNewTableToDefault } from '../actions';
import { MyAlert } from '../components/MyAlert';
import  CustomModal from '../components/universal/CustomModal';
import { postData } from '../utils/api';
import { $loading } from '../utils/ux';

export function HomePage(props) {
  const dispatch = useDispatch();
  const newTableRows = useSelector((state) => state.newTableRows);
  const cur_table = useSelector((state) => state.table);
  const table_name = useSelector((state) => state.table_name);
  const primaryKey = useSelector((state) => state.primaryKey);
  const editNewRowDialogOpen = useSelector((state) => state.newRow);
  const constrains = useSelector((state) => state.constrains);
  const editing = useSelector((state) => state.editing);
  const errorsInNewTable = useSelector((state) => state.validationErrors);


  const saveToDatabase = async () => {
    /// we dont send to DB rows with id as it is probably PK
    const readyToUpd = [...newTableRows];
    for (let key in readyToUpd) {
      const newRowWithNoKey = { ...readyToUpd[key] };
      // del PK only if it is nextVal
      if (String(constrains[primaryKey].defaultValue).slice(0, 8) === 'nextval(') {
        delete newRowWithNoKey[primaryKey];
        console.log('deleting');
      }
      readyToUpd[key] = newRowWithNoKey;
    }
    // console.log('ready to upd', readyToUpd)
    dispatch({ type: 'SET_LOADING', payload: true });
    const addedRows = await postData('/api/table', { table : table_name, rows: readyToUpd});
    if (addedRows) {
      const newTable = [...cur_table, ...addedRows]
      dispatch(setTable(newTable));
      // should clear everything in newTable
      dispatch(setNewTableToDefault())

      dispatch(openNewRow(false));
    }
   
    $loading(false)
  };

  const closeEditModal = () => {
    dispatch(openNewRow(false));
    console.log('closeModal');
    dispatch(setEditMode(false));
     // if more than 1 row => we are edditing new model, so when close set to default
     if (newTableRows.length > 1) {
      dispatch(setNewTableToDefault())
    }
  }

  return (
    <>
      <MyAlert />
      <Controllers />
      <CurrTable />
      <WelcomeMessage />
      
      <CustomModal
        title = 'Updating table with this values'
        show = {editNewRowDialogOpen}
        onSuccess = {saveToDatabase}
        mainDisabled = {editing || errorsInNewTable !== 0}
        success_text = 'Save to DB'
        onClose = {closeEditModal}
        onSecondary = {() => dispatch(openOnCellErrorMessage(true))}
        secondary_text = 'Show errors'
        mainButtonStyles = {{ variant: 'outlined', color: 'secondary'}}
      >
        <NewTable />
      </CustomModal>
    </>
  );
}
