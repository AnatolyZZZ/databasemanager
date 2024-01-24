import {
  Route, Routes, useNavigate, useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HomePage } from './pages/HomePage';
// import { Service } from './pages/Service';
import { Loading } from './components/misc/Loading';
import { LoginRegister } from './pages/LoginRegister';
import {
  setTable, setColumns, setTableNames, setSelected, setPrimaryKey,
  setLengths, setEditableColumns, setNewTableRows, setModels, setVersions,
  restoreFilters, setEditRow, myNavigate,
} from './actions';
import './App.css';
import { $loading } from './utils/ux';
import { getData } from './utils/api';
import { HotKeys } from './pages/HotKeys';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const table_name = useSelector((state) => state.table_name);
  const column_names = useSelector((state) => state.columns);
  const cur_model = useSelector((state) => state.model);
  const routeToNavigate = useSelector((state) => state.navigate);

  // navigate if requested
  useEffect(() => {
    navigate(routeToNavigate);
  }, [routeToNavigate]);

  // update curent routeToNavigate state if navigated not with my custom function
  useEffect(() => {
    dispatch(myNavigate(pathname));
  }, [pathname]);

  // first when App is loaded get tablenames
  useEffect(() => {
    const abortController = new AbortController();
    const getTableNames = async () => {
      $loading(true);
      const data = await getData('/api/general/tablenames', {}, abortController, 'Failed to fetch tablenames, wait and reload page');
      $loading(false);
      if (data) dispatch(setTableNames(data));
    };
    getTableNames();
    const filters = localStorage.getItem('dbm_filters');
    if (filters) {
      dispatch(restoreFilters(JSON.parse(filters)));
    }
    return () => abortController.abort();
  }, [dispatch]);

  // when table_name is choosen get data, columnames, constrains and PK
  useEffect(() => {
    const abortController1 = new AbortController();
    const abortController2 = new AbortController();
    const getTableData = async () => {
      $loading(true);
      const data = await getData(`/api/table/${table_name}`, { model: 'All models', version: 'All versions' }, abortController1, 'Failed to fetch data, please reload page');
      const data2 = await getData(`/api/general/columnnames/${table_name}`, {}, abortController2, 'Failed to fetch data, please reload page');
      if (data) dispatch(setTable(data));
      // eslint-disable-next-line
      if (!data2) return console.log('data2 empty');
      const { columns, primaryKey, constrains } = data2;
      if (primaryKey) dispatch(setPrimaryKey(primaryKey));
      if (columns?.includes('model')) getModels();
      else dispatch(setModels([]));
      if (columns && constrains) dispatch(setColumns([columns, constrains]));

      const updateSelected = () => {
        const storedItem = localStorage.getItem(`${table_name}_selected`);
        const previousSelected = storedItem ? JSON.parse(storedItem) : [];
        // first switch all columns On
        const newSelected = columns.map((elt) => ([elt, true]));
        // for each element of previously selected find element in new selected and switch it to same value
        previousSelected.forEach(([name, value]) => {
          const newSelectedElement = newSelected.find(([new_name, new_val]) => new_name === name);
          if (newSelectedElement) newSelectedElement[1] = value;
        });
        // switch off PK
        const switchOffPK = () => {
          const pkColumn = newSelected.find(([new_name, new_val]) => new_name === primaryKey);
          if (pkColumn) pkColumn[1] = false;
        };
        // TODO add ability to switch or not to switch PK automatically
        if (true) switchOffPK();
        dispatch(setSelected(newSelected));
      };
      if (columns) updateSelected();

      // have to do manualy because use free version of DataGrid
      const updateLengths = () => {
        const lengths = new Map();
        // first lengths is map from names to names length in symbols
        columns.forEach((name) => lengths.set(name, String(name).length + 3));

        // now upgrade with max length of data in each row
        data.forEach((row) => Object.entries(row).forEach(
          ([key, value]) => lengths.set(key, Math.max(lengths.get(key), String(value).length)),
        ));
        dispatch(setLengths(lengths));
      };
      if (data && columns) updateLengths();

      // check witch columns are not editable
      const isSerial = (column) => {
        const defaultValString = String(constrains[column].defaultValue);
        const nextVal = defaultValString.slice(0, 8);
        return nextVal === 'nextval(';
      };
      const checkEditable = () => {
        const editableColumns = columns.filter((column) => !isSerial(column));
        // create 1 empty row for newTable
        const editRow = [editableColumns.reduce(
          (acc, val) => {
            acc[val] = '';
            return acc;
          },
          { [primaryKey]: 1 },
        )];
        dispatch(setEditableColumns(editableColumns));
        dispatch(setNewTableRows(editRow));
        dispatch(setEditRow(editRow));
      };
      if (columns && constrains && primaryKey) checkEditable();
      $loading(false);
    };
    if (table_name !== '') getTableData();

    return () => {
      abortController1.abort();
      abortController2.abort();
    };
  }, [table_name, dispatch]);

  const getModels = async () => {
    const abortController = new AbortController();
    const data = await getData('/api/general/models', { table: table_name }, abortController, 'error occured while getting models');
    if (data) dispatch(setModels(data.map((e) => e.model)));
    else dispatch(setModels([]));
  };

  // geting versions every time when change cur_model
  useEffect(() => {
    const getVersions = async (abortController) => {
      if (!column_names.includes('version')) return dispatch(setVersions([]));
      const data = await getData('/api/general/versions', { table: table_name, model: cur_model }, abortController, 'error occured while getting versions');
      if (data) dispatch(setVersions(data?.map((e) => e.version)));
      else dispatch(setVersions([]));
    };
    const abortController = new AbortController();
    if (cur_model !== '') getVersions(abortController);
    return () => abortController.abort();
  }, [cur_model, dispatch, table_name, column_names]);

  return (
    <div className="App">
      <Loading />
      <Routes>
        <Route path="/" Component={HomePage} />
        {/* <Route path="/service" Component={Service} /> */}
        <Route path="loginregister" Component={LoginRegister} />
        <Route path="hotkeys" Component={HotKeys} />
      </Routes>
    </div>
  );
}

export default App;
