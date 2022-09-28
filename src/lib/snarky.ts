import {
    SelfProof,
    Field,
    Experimental,
    verify,
    CircuitValue,
    PublicKey,
    UInt32,
    Poseidon,
    prop,
    PrivateKey,
    Signature,
    isReady, Proof,
} from 'snarkyjs';

export class User extends CircuitValue {
    @prop publicKey: PublicKey;
    @prop age: UInt32;

    constructor(publicKey: PublicKey, age: UInt32) {
        super();
        this.publicKey = publicKey;
        this.age = age;
    }

    hash(): Field {
        return Poseidon.hash(this.toFields());
    }
}

let KYCProgram = Experimental.ZkProgram({
    publicInput: Field,

    methods: {
        verifyAge: {
            privateInputs: [User],

            method(userHash: Field, user: User) {
                user.age.assertGte(UInt32.from(21));
                // we have to constraint the public input to the users hash
                userHash.assertEquals(user.hash());
            },
        },
    },
});

class MerkleWitness extends Experimental.MerkleWitness(3) {}

export class Prover {
    constructor(private program: typeof KYCProgram) {
    }

    public static async build(): Promise<Prover> {
        console.log('waiting for snarkyjs to be ready...', new Date().toISOString());
        await isReady;

        console.log('compiling...', new Date().toISOString());
        await KYCProgram.compile();
        console.log('compiled...', new Date().toISOString());

        return new Prover(KYCProgram);
    }

    public generateProof(user: User):Promise<Proof<Field>> {
        return this.program.verifyAge(user.hash(), user);
    }

    public verifyProof(proof: Proof<Field>):boolean {
        try {
            proof.verify();
            return true;
        } catch (e) {
            return false;
        }
    }
}
