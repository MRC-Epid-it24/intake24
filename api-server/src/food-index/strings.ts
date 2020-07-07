export class CaseInsensitiveString {
  readonly original: string;
  readonly lowerCase: string;

  constructor(original: string) {
    this.original = original;
    this.lowerCase = original.toLocaleLowerCase();
  }
}
