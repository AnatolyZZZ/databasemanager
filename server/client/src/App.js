import { Route, Routes } from "react-router-dom";
import { HomePage } from "./components/Homepage";

function App() {
  return (<div className="App">
    <Routes>
      <Route path='/' Component={HomePage}/>
    </Routes>
  </div> 
  );
}

export default App;
