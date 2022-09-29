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
  isReady,
  Proof,
} from "snarkyjs";

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
  static verificationKey: string | undefined = undefined;

  static proverProgram: typeof KYCProgram | undefined = undefined;

  static compileStarted: boolean = false;

  public static async build(): Promise<void> {
    if (Prover.compileStarted) return;
    Prover.compileStarted = true;
    console.log(
      "waiting for snarkyjs to be ready...",
      new Date().toISOString()
    );
    await isReady;

    console.log("compiling...", new Date().toISOString());
    let { verificationKey } = await KYCProgram.compile();
    Prover.verificationKey = verificationKey;
    console.log("compiled...", new Date().toISOString());

    Prover.proverProgram = KYCProgram;
  }

  static async generateProof(age: number): Promise<string> {
    let user = new User(PrivateKey.random().toPublicKey(), UInt32.from(age));
    return JSON.stringify(
      await Prover.proverProgram!.verifyAge(user.hash(), user)
    );
  }

  static async verifyProof(proof: Proof<Field>): Promise<boolean> {
    try {
      // NOTE: proof.verify() just verifies if a proof is valid, however, you most likely want to verify the proof *against* a verificationKey (verifier index) to make sure the proof actually fits your initial program
      // proof.verify();
      return await verify(proof, Prover.verificationKey!);
    } catch (e) {
      return false;
    }
  }
}
