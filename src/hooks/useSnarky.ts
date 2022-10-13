import {useCallback, useEffect, useRef, useState} from "react";

export const useSnarky = () => {
    // let Prover: any;

    const [building, setBuilding] = useState<boolean>(false);
    const [prover, setProver] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [proof, setProof] = useState<string>();
    const ProverRef = useRef<any>();

    useEffect(() => {
        (async () => {
            let ProverLib = await import("../lib/snarky");
            // Prover = ProverLib.Prover;
            ProverRef.current = ProverLib.Prover;
        })();
    });

    let Prover = ProverRef.current;

    const prove = useCallback(async (dobLeaf: string) => {
        if (prover) {
            console.log("Proving...");
            setProof("Proving...");
            const result = await Prover.generateProof(dobLeaf);
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
                    prove(dobLeaf);
                })
                .catch((e: any) => {
                    console.log("Building failed");
                    setError(e.toString());
                    console.error(e);
                });
        }
    }, [prover, Prover, building]);

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
    }, [building, Prover]);

    return {
        compile,
        prove,
        proof,
        error,
        building
    }
};