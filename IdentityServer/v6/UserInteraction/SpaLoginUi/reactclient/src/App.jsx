import { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Callback from './components/Callback';
import SilentRenew from './components/SilentRenew';
import CallApi from './components/CallApi';
import Home from './components/Home';
import authService from './services/authService';
import './App.css'

function App() {
  const [username, setUsername] = useState();

  authService.getUserName().then(
    (name) => {
      setUsername(name);
    },
    (err) => {
      console.log(err);
    }
  );

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">首页</Link>
            </li>
            <li>
              <Link to="/callapi">调用WebApi</Link>
            </li>
            <li>
              <button onClick={authService.signOut}>注销登录</button>
            </li>
            <li>
              <span>{username ? `欢迎你，${username}` : '未登录'}</span>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/callback">
            <Callback />
          </Route>
          <Route path="/silentrenew">
            <SilentRenew />
          </Route>
          <Route path="/callapi">
            <CallApi />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App
