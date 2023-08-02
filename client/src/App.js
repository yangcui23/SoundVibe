import './App.css';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';
const code = new URLSearchParams(window.location.search).get("code")

function App() {
  return code ? <Dashboard code={code} /> : <Login />
  }

  export default App;
