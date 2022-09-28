import React, {useCallback, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Prover, User} from "./lib/snarky";
import {Field, PrivateKey, Proof, UInt32} from "snarkyjs";

const App = () => {
  const [building, setBuilding] = useState<boolean>(false);
  const [prover, setProver] = useState<Prover>();
  const [error, setError] = useState<string>();
  const [proof, setProof] = useState<Proof<Field>>();
  const [age, setAge] = useState<number>(36);

  useEffect(() => {
    console.log("Building prover...", building);
    if (!building) {
      setBuilding(true);
      Prover.build().then((p) => {
        setProver(p);
        setBuilding(false);
      }).catch((e) => {
        console.log("Building failed")
        setError(e.toString());
        console.error(e);
      });
    }
  }, [building]);

  const prove = useCallback(async () => {
    if (prover) {
      console.log("Proving...")
      const user = new User(PrivateKey.random().toPublicKey(), UInt32.from(age));
      const result = await prover.generateProof(user);
      setProof(result);
      console.log("proof: ", result);
    }
  }, [prover, age]);

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} width="200vw" className="App-logo" alt="logo"/>
          <div>
            <div style={{ marginBottom: "2px" }}>
              <label htmlFor="age">Age: </label>
              <input id="age" onChange={(e) => setAge(parseInt(e.target.value))} type="number" value={age} />
              <button onClick={prove} disabled={!prover}>Prove</button>
            </div>
            <textarea style={{ width: "20vw"}} value={proof?.toString() || error || ""} readOnly={true}/>
          </div>
        </header>
      </div>
  );
};

export default App;
