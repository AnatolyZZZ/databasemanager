import { Route, Routes } from "react-router-dom";
import { HomePage } from "./components/Homepage";
import { Service } from "./components/Service";
import { Loading } from './components/misc/Loading';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {ACTIONS} from './actions'
import {Alert, IconButton, Collapse} from '@mui/material';
import {Close} from '@mui/icons-material'
import { setLoading, setTable, setColumns, setTableNames, setSelected, setPrimaryKey, setAlertError, setAlertErrorMessage, setLengths, setEditableColumns, setNewTableRows, setModels, setVersions} from './actions';
import './App.css'

function App() {

  const dispatch = useDispatch();
  const alertOpen = useSelector(state => state.alerErrorOn);
  const alertMessage = useSelector(state => state.alertErrorMessage);
  const table_name = useSelector(state => state.table_name);
  const root_url = useSelector(state => state.root_url);
  const column_names = useSelector(state => state.columns);
  // console.log('column names', column_names)
  const cur_model = useSelector(state => state.model);
  const cur_version = useSelector(state => state.version);

  useEffect(() => {
    const abortController1 = new AbortController()
    const abortController2 = new AbortController()
    async function fetchData () {
      dispatch({type: ACTIONS.SET_LOADING, payload: true})
      try {
        const res1 = await fetch(`${root_url}/api/table/${table_name}?model=${cur_model}&version=${cur_version}`, {signal : abortController1.signal});
        const res2 = await fetch(`${root_url}/api/general/columnnames/${table_name}`, {signal : abortController2.signal});
        if (res1.status !== 200 || res2.status !== 200) {
          dispatch(setAlertErrorMessage('Failed to fetch data, please reload page'));
          console.log(res1.status, res2.status)
          dispatch(setAlertError(true))
          dispatch(setLoading(false));
        } else {
            const data1 = await res1.json();
            const data2 = await res2.json();
            dispatch(setLoading(false));
            dispatch(setTable(data1));
            // console.log('data1', data1)
            // [0] is columns [1] is constrains
            dispatch(setColumns([data2[0], data2[2]]));
            dispatch(setPrimaryKey(data2[1]));
            // update selected 
            const storedItem = localStorage.getItem(`${table_name}_selected`);
            const previousSelected = storedItem ?  JSON.parse(storedItem) : []
            const newSelected = data2[0].map(elt => ([elt, true]));
            previousSelected.forEach(elt => {
              const idx = newSelected.findIndex((element) => elt[0] === element[0]);
              if (idx !== -1) {
              newSelected[idx][1] = elt[1];
              }
            })
          // turn off primary key
          for (let elt of newSelected) {
            if (elt[0] === data2[1]) {
              elt[1] = false
            }
          }
          dispatch(setSelected(newSelected));
          
          // now update lengths 
          const lengths = new Map();
         
          
          // first set column names length
          for (let column of data2[0]) {
            lengths.set(column, String(column).length);
          }
          // for each row for each column update max length in symbols
          for (let row of data1) {
            for (let key in row) {
            lengths.set(key, Math.max(lengths.get(key), String(row[key]).length))
          }

          dispatch(setLengths(lengths))
          // later can use it for columns but it is in symbols! 

          // now upd editable columns 
          const editable = data2[0].filter(elt => !isSerial(elt))

          function isSerial (column) {
            const defaultValString = String(data2[2][column]['defaultValue']);
            const nextVal = defaultValString.slice(0, 8);
            return nextVal === 'nextval(' ? true : false
          }
          // when download new table lets set new table rows to 1 empty row
          const editRow = [{id : 1}];
          editable.forEach(elt => editRow[0][elt]='');
          dispatch(setNewTableRows(editRow));

          dispatch(setEditableColumns(editable));
      }
  }


      } catch (error) {
        dispatch(setAlertErrorMessage('Failed to fetch data, please reload page'));
        console.log(error);
        dispatch(setAlertError(true))
        dispatch(setLoading(false));
      }
      
    }

    if (table_name !== '') {
      fetchData();
    }

    return () => {
      abortController1.abort();
      abortController2.abort();
    }
  ;
  }, [table_name, dispatch, root_url, cur_model, cur_version]);

  // 

  useEffect(() => {
    const abortController = new AbortController();
    async function  fetchTablenames () {
      dispatch({type: ACTIONS.SET_LOADING, payload : true});
      try {
        const res = await fetch(`${root_url}/api/general/tablenames`, {signal : abortController.signal});
        if (res.status === 200) {
          const data = await res.json();
          dispatch(setTableNames(data));
          dispatch(setLoading(false));
       
          dispatch(setAlertError(false))
        } else {
          dispatch(setAlertErrorMessage('Failed to fetch tablenames, wait or reload page'));
          dispatch(setAlertError(true))
        }
      } catch (error) {
        console.log(error)
        dispatch(setLoading(false));
        dispatch(setAlertErrorMessage('Failed to fetch tablenames, wait or reload page'));
        dispatch(setAlertError(true))
      }
    }
    fetchTablenames();
    return () => abortController.abort()
  }, [dispatch, root_url])


  // getting models every time when change column_names

  /// !!!!! ----- probably should change to column name what if  column names are similar in two tables?!
  useEffect(()=>{
    const abortController = new AbortController();
    // console.log('runing useEffect', column_names);
    const getModels = async () => {
      if (column_names.includes('model')) {
        try {
          const res = await fetch(`${root_url}/api/general/models?table=${table_name}`);
          const data = await res.json()
          if (res.status === 200) {
            // console.log('status 200 dispatching', data)
            dispatch(setModels(data.map(elt => elt.model)));
            // console.log('got models', data.map(elt => elt.model))
          } else {
            console.log('res.status!==200 dispatching[]')
            dispatch(setModels([]));
          }
        } catch (error) {
            console.log(error);
            dispatch(setAlertErrorMessage('error occured while getting models'));
            dispatch(setAlertError(true))
        }
        
      } else {
        dispatch(setModels([]));
      }
    }
    getModels();
    return () => abortController.abort()

  },[column_names])

  // geting versions every time when change model
  useEffect(()=>{
    const abortController = new AbortController();
    const getVersions= async () => {
      if (column_names.includes('version')) {
        try {
          const res = await fetch(`${root_url}/api/general/versions?table=${table_name}&model=${cur_model}`);
          const data = await res.json()
          if (res.status === 200) {
            // console.log('status 200 dispatching', data)
            dispatch(setVersions(data.map(elt => elt.version)));
            // console.log('got models', data.map(elt => elt.model))
          } else {
            console.log('res.status!==200 dispatching []to versions')
            dispatch(setVersions([]));
          }
        } catch (error) {
            console.log(error);
            dispatch(setAlertErrorMessage('error occured while getting versions'));
            dispatch(setAlertError(true))
        }
        
      } else {
        dispatch(setVersions([]));
      }
    }
    getVersions();
    return () => abortController.abort()
    
  },[cur_model])

  return (<div className="App">
    <Loading/>
    <Collapse in={alertOpen}>
      <Alert 
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              dispatch(setAlertError(false));
            }}>
              <Close fontSize="inherit" />
          </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {alertMessage}
      </Alert>
    </Collapse>
    <Routes>
      <Route path='/' Component={HomePage}/>
      <Route path='/service' Component={Service}/>
    </Routes>
  </div> 
  );
}

export default App;
