import {useCallback, useEffect, useRef, useState} from "react";
import { UInt32, Field, CircuitString, Proof} from "snarkyjs";

export const useSnarky = () => {
    // let Prover: any;

    const [building, setBuilding] = useState<boolean>(false);
    const [prover, setProver] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [proof, setProof] = useState<string>();
    const ProverRef = useRef<any>();
    // const [proverRef, setProverRef] = useState<Prover>(); 
    const [verifying, setVerifying] = useState<boolean>(false);

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
            //extract data from dobLeaf
            const claims = dobLeaf.toString().split("|").map(claim => claim.split(":"));
            const yearClaim = claims.find(claim => claim[1] === "dateOfBirth.year");
            // TODO is this the correct way to throw an error in a zk program?
            if (!yearClaim) throw new Error("No year claim found");

            // now we have the year, turn it into a Uint32 and compare
            const year = UInt32.from(yearClaim[3]);
            let date = new Date().getFullYear() - 21
            console.log(date)
            const publicYear = UInt32.from(date.toString());
            const salt = CircuitString.fromString(yearClaim[2]);//Field.fromString(yearClaim[2])
            
            console.log("Proving...");
            setProof("Proving...");
            const result = await Prover.generateProof(year, salt, publicYear);
            setProof(result);
            console.log("proof: ", result);
            console.log("Verifying proof...")
            const verifyResult = await result.verify();
            console.log("Verified: ", verifyResult)
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

    const verify = useCallback(async (proof: string) => {
        console.log("Verifying proof...", verifying);
        const circuitProof = (Proof<Field>).fromJSON(JSON.parse(proof));
        setVerifying(true);
        Prover.verifyProof(circuitProof)
            .then((res: any) => {
                console.log("Verifying result: ", res)
            }).catch((err: any) => {
                console.log("Verifying failed")
                setError(err.toString())
                console.error(err)
            })
    }, [verifying])

    return {
        compile,
        prove,
        verify,
        proof,
        error,
        building
    }
};