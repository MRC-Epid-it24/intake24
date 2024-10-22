import type { HashedPassword, PasswordAlgorithm } from '.';

import bcrypt from 'bcryptjs';

export default class PasswordBcrypt implements PasswordAlgorithm {
  id = 'bcrypt';

  private readonly rounds: number;

  constructor(rounds = 10) {
    this.rounds = rounds;
  }

  async hash(password: string): Promise<HashedPassword> {
    const salt = await bcrypt.genSalt(this.rounds);
    const hash = await bcrypt.hash(password, salt);

    return Promise.resolve({ hash, salt });
  }

  async verify(input: string, hashedPassword: HashedPassword): Promise<boolean> {
    return bcrypt.compare(input, hashedPassword.hash);
  }
}
