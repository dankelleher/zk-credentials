import React, {useCallback, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Prover, User} from "./lib/snarky";
import {Field, PrivateKey, Proof, UInt32} from "snarkyjs";

const App = () => {
  const [building, setBuilding] = useState<boolean>(false);
  const [prover, setProver] = useState<Prover>();
  const [proof, setProof] = useState<Proof<Field>>();

  useEffect(() => {
    console.log("Building prover...", building);
    if (!building) {
      setBuilding(true);
      Prover.build().then((p) => {
        setProver(p);
        setBuilding(false);
      }).catch((e) => {
        console.log("Building failed")
        console.error(e);
      });
    }
  }, [building]);

  const prove = useCallback(async () => {
    if (prover) {
      console.log("Proving...")
      const user = new User(PrivateKey.random().toPublicKey(), UInt32.from(36));
      const result = await prover.generateProof(user);
      setProof(result);
      console.log("proof: ", result);
    }
  }, [prover]);

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <p>
            <button onClick={prove} disabled={!prover}>Prove</button>
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
};

export default App;
