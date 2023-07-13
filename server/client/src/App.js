import { Route, Routes } from "react-router-dom";
import { HomePage } from "./components/Homepage";
import { Loading } from './components/misc/Loading'

function App() {
  return (<div className="App">
    <Loading/>
    <Routes>
      <Route path='/' Component={HomePage}/>
    </Routes>
  </div> 
  );
}

export default App;
