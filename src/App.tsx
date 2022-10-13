import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {Credential} from "./components/Credential";
import {Merkle} from "./components/Merkle";

type Tab = 'credential' | 'merkle';

const App = () => {

  const [selected, setSelected] = useState<Tab>('credential');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} width="200vw" className="App-logo" alt="logo" />
        <ul>
            <li onClick={() => setSelected('credential')}>Credential</li>
            <li onClick={() => setSelected('merkle')}>Merkle</li>
        </ul>
        {selected === 'credential' && <Credential />}
        {selected === 'merkle' && <Merkle />}
      </header>
    </div>
  );
};

export default App;
