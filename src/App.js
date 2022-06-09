import _ from 'lodash';
import logo from './logo.svg';
import './App.css';
import faker from './Router';

function App() {
  const a = _.cloneDeep({});
  faker();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>hello3</div>
        <div>hello2</div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
