import React, { useCallback, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
const App = () => {
  let Prover: any;

  const [building, setBuilding] = useState<boolean>(false);
  const [prover, setProver] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [proof, setProof] = useState<string>();
  const [age, setAge] = useState<number>(36);

  useEffect(() => {
    (async () => {
      let ProverLib = await import("./lib/snarky");
      Prover = ProverLib.Prover;
    })();
  });

  const prove = useCallback(async () => {
    if (prover) {
      console.log("Proving...");
      setProof("Proving...");
      const result = await Prover.generateProof(age);
      setProof(result);
      console.log("proof: ", result);
    } else {
      console.log("Building prover...", building);
      setProof("Building prover...");
      setBuilding(true);
      Prover.build()
        .then((p: any) => {
          setProver(true);
          setBuilding(false);
          prove();
        })
        .catch((e: any) => {
          console.log("Building failed");
          setError(e.toString());
          console.error(e);
        });
    }
  }, [prover, age, building]);

  const compile = useCallback(async () => {
    console.log("Building prover...", building);
    setProof("Building prover...");
    setBuilding(true);
    Prover.build()
      .then((p: any) => {
        setProver(true);
        setBuilding(false);
      })
      .catch((e: any) => {
        console.log("Building failed");
        setError(e.toString());
        console.error(e);
      });
  }, [prover, building]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} width="200vw" className="App-logo" alt="logo" />
        <div>
          <div style={{ marginBottom: "2px" }}>
            <label htmlFor="age">Age: </label>
            <input
              id="age"
              onChange={(e) => setAge(parseInt(e.target.value))}
              type="number"
              value={age}
            />
            <button onClick={compile}>Compile</button>
            <button onClick={prove}>Prove</button>
          </div>
          <textarea
            style={{ width: "20vw" }}
            value={proof?.toString() || error || ""}
            readOnly={true}
          />
        </div>
      </header>
    </div>
  );
};

export default App;
