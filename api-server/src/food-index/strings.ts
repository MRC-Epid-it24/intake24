export class CaseInsensitiveString {
  readonly lowerCase: string;

  constructor(str: string) {
    this.lowerCase = str.toLocaleLowerCase();
  }
}
