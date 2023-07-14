import { Route, Routes } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { Loading } from './components/misc/Loading';
import { useEffect  } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setTable, setColumns, setTableNames, setSelected} from './actions';
import './App.css'

async function fetchData(url) {
  return fetch(url)
    .then(response => response.json());
}

function App() {

  const dispatch = useDispatch();
  const table_name = useSelector(state => state.table_name);
  const root_url = useSelector(state => state.root_url)

  useEffect(() => {
    if (table_name !== '') {
    const abortController1 = new AbortController()
    const abortController2 = new AbortController()
    
    const fetchPromises = [
      fetchData(`${root_url}/api/general/table/${table_name}`, {signal : abortController1.signal}),
      fetchData(`${root_url}/api/general/columnnames/${table_name}`, {signal : abortController2.signal})
    ]
    dispatch({type: 'SET_LOADING', payload: true})
    
    Promise.all(fetchPromises)
    .then(([data1, data2]) => {
      dispatch(setLoading(false));
      dispatch(setTable(data1));
      dispatch(setColumns(data2));
      // update selected 
      const storedItem = localStorage.getItem(`${table_name}_selected`);
      const previousSelected = storedItem ?  JSON.parse(storedItem) : []
      const newSelected = data2.map(elt => ([elt, true]));
      previousSelected.forEach(elt => {
        const idx = newSelected.findIndex((element) => elt === element[0]);
        if (idx !== -1) {
          newSelected[idx][1] = elt[1];
        }
      })
      dispatch(setSelected(newSelected));
    })
    .catch((error) => {
      console.log(error)
      dispatch(setLoading(false));
    })
    return () => {
      abortController1.abort();
      abortController2.abort();
    }
  };
  }, [table_name, dispatch, root_url]);

  useEffect(() => {
    const abortController = new AbortController();
    fetch(`${root_url}/api/general/tablenames`)
    .then(res => res.json())
    .then(data => dispatch(setTableNames(data)))
    .catch((error) => {
      console.log(error)
      dispatch(setLoading(false));
    })
    return () => abortController.abort()
  }, [dispatch, root_url])

  return (<div className="App">
    <Loading/>
    <Routes>
      <Route path='/' Component={HomePage}/>
    </Routes>
  </div> 
  );
}

export default App;
