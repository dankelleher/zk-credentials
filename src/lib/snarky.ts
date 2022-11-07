import { FaYoutubeSquare } from "react-icons/fa";
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
  Proof, CircuitString,
} from "snarkyjs";

// export class User extends CircuitValue {
//   @prop dobLeaf: CircuitString;

//   constructor(dobLeaf: string) {
//     super();
//     this.dobLeaf = CircuitString.fromString(dobLeaf);
//   }

//   hash(): Field {
//     return Poseidon.hash(this.toFields());
//   }
// }
export class User extends CircuitValue {
  @prop year: UInt32 //year of birth
  @prop salt: CircuitString
  @prop publicYear: UInt32

  constructor(year: UInt32, salt: CircuitString, publicYear: UInt32){
    super()
    this.year = year
    this.salt = salt
    this.publicYear = publicYear
  }

  hash(): Field {
    return Poseidon.hash(this.toFields())
  }
}

let KYCProgram = Experimental.ZkProgram({
  publicInput: Field,

  methods: {
    // verifyAge: {
    //   privateInputs: [User],

    //   method(userHash: Field, user: User) {
    //     // The user's date of birth is a compound claim made up of 3 claims (day, month, year)
    //     // String example: urn:dateOfBirth.day:6a3cdebe07da67d5a16b6cd0408effaa04305d66e72db592c0704dcd2150f62b:1|urn:dateOfBirth.month:33667247a5f630331db55e0c04ac579a646adc0ef5a16035c745108a70f36e7c:1|urn:dateOfBirth.year:99c19bcab9d51994b688ba1ed0aa51bd818c72e2e6600fde6cba73811373ef3d:1990|
    //     // TODO checking only year here
    //     const claims = user.dobLeaf.toString().split("|").map(claim => claim.split(":"));
    //     const yearClaim = claims.find(claim => claim[1] === "dateOfBirth.year");
    //     // TODO is this the correct way to throw an error in a zk program?
    //     if (!yearClaim) throw new Error("No year claim found");

    //     // now we have the year, turn it into a Uint32 and compare
    //     const year = UInt32.from(yearClaim[3]);
    //     const twentyOneYearsAgo = new Date().getFullYear() - 21;

    //     year.assertLte(UInt32.from(twentyOneYearsAgo));
    //     // we have to constraint the public input to the users hash
    //     userHash.assertEquals(user.hash());
    //   },
    // },
    verifyAge: {
      privateInputs: [User],

      method(publicHash: Field, user: User) {
        //check if the hash(salt + age) == publicHash
        publicHash.assertEquals(
          // Poseidon.hash(
          //   user.salt.toFields().concat(user.year.toFields())
          // )
          user.hash()
        )
        
        //check if the user is 21 years old
        // user.year.assertLte(user.publicYear);
      }
    }
  },
});

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

  // static async generateProof(age: number): Promise<string> {
  //   let user = new User(PrivateKey.random().toPublicKey(), UInt32.from(age));
  //   return JSON.stringify(
  //     await Prover.proverProgram!.verifyAge(user.hash(), user)
  //   );
  // }

  static async generateProof(year: UInt32, salt: CircuitString, publicYear: UInt32): Promise<any> {
    let user = new User(year, salt, publicYear);
    return JSON.stringify(
        await Prover.proverProgram!.verifyAge(user.hash(), user)
    );
    // return await Prover.proverProgram!.verifyAge(user.hash(), user)
  }

  static async verifyProof<T>(proof: Proof<T>): Promise<boolean> {
    try {
      // NOTE: proof.verify() just verifies if a proof is valid, however, you most likely want to verify the proof *against* a verificationKey (verifier index) to make sure the proof actually fits your initial program
      // proof.verify();
      return await verify(proof, Prover.verificationKey!);
    } catch (e) {
      return false;
    }
  }
}
