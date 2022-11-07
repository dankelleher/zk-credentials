import {useCallback, useEffect, useRef, useState} from "react";
import { UInt32, Field, CircuitString, Proof} from "snarkyjs";
import {ZKProof} from "../types/ZKProof";

export const useSnarky = () => {
    const [prover, setProver] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [proof, setProof] = useState<ZKProof>();
    const ProverRef = useRef<any>();
    const [verifying, setVerifying] = useState<boolean>(false);
    const [status, setStatus] = useState<'uninitialised' | 'compiling' | 'proving' | 'error' | 'ready'>('uninitialised');

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
            const publicYear = UInt32.from(date);
            const salt = CircuitString.fromString(yearClaim[2]);//Field.fromString(yearClaim[2])

            console.log("Proving...");
            setStatus('proving');

            try {
                const result = await Prover.generateProof(year, salt, publicYear)
                setStatus('ready');
                setProof(result);
                console.log("proof: ", result);
                console.log("Verifying proof...")
                const verifyResult = await result.verify();
                console.log("Verified: ", verifyResult)
            } catch (e: any) {
                console.log(e)
                setStatus('error');
                setError(e.message);
            }
        } else {
            setStatus('compiling');
            // TODO remove duplication with the below
            Prover.build()
                .then((p: any) => {
                    setProver(true);
                    setStatus('ready');
                    prove(dobLeaf);
                })
                .catch((e: any) => {
                    setStatus('error');
                    console.log("Building failed");
                    setError(e.toString());
                    console.error(e);
                });
        }
    }, [prover, Prover, status]);

    const compile = useCallback(async () => {
        setStatus('compiling');
        Prover.build()
            .then((p: any) => {
                setProver(true);
                setStatus('ready');
            })
            .catch((e: any) => {
                setStatus('error');
                console.log("Building failed");
                setError(e.toString());
                console.error(e);
            });
    }, [status, Prover]);

    const verify = useCallback(async (proof: ZKProof) => {
        console.log("Verifying proof...", verifying);

        // this is not JSON, but rather the string representation of the proof,
        // but Snarky calls it JSON
        // const circuitProof = Proof.fromJSON(proof);
        const publicYear = UInt32.from(proof.publicInput[0]);
        const p = {
            ...proof,
            publicInput: [publicYear],
        }
        const circuitProof = new Proof<UInt32[]>(p)
        console.log("Proof: ", circuitProof)
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
        status
    }
};