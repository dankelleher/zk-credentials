import React, {FC, useState} from "react";
import {useSnarky} from "../hooks/useSnarky";

export const Merkle: FC = () => {
    const snarky = useSnarky();
    const [age, setAge] = useState<number>(36);
    const [dobLeaf, setDOBLeaf] = useState<string>();

    return <div>
        <div style={{ marginBottom: "2px" }}>
            <label htmlFor="age">Age: </label>
            <input
                id="age"
                onChange={(e) => setAge(parseInt(e.target.value))}
                type="number"
                value={age}
            />
            <label htmlFor="dobLeaf">DOB Leaf: </label>
            <input id="dobLeaf" onChange={(e) => setDOBLeaf(e.target.value)} type="text"/>
            <button onClick={snarky.compile}>Compile</button>
            <button onClick={() => dobLeaf && snarky.prove(dobLeaf)}>Prove</button>
        </div>
        <textarea
            style={{ width: "20vw" }}
            value={snarky.proof?.toString() || snarky.error || ""}
            readOnly={true}
        />
    </div>
}