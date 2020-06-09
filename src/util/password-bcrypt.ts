import bcrypt from 'bcryptjs';
import {PasswordAlgorithm, HashedPassword} from "@/util/passwords";

export class PasswordBcrypt implements PasswordAlgorithm {
  id = "bcrypt";

  private _rounds: number;

  constructor(rounds: number = 10) {
    this._rounds = rounds;
  }

  async hash(password: string): Promise<HashedPassword> {
    const salt = await bcrypt.genSalt(this._rounds);
    const hash = await bcrypt.hash(password, salt);

    return Promise.resolve({hash, salt});
  }

  async verify(input: string, hashedPassword: HashedPassword): Promise<boolean> {
    const hash = await bcrypt.hash(input, hashedPassword.salt);

    return Promise.resolve(hash == hashedPassword.hash);
  }
}
