export default class DemographicRange {
  readonly start: number;

  readonly end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  static fromJson(start?: number | null, end?: number | null): DemographicRange | null {
    if (typeof start !== 'number' || typeof end !== 'number') return null;

    return new DemographicRange(start, end);
  }

  clone(): DemographicRange {
    return new DemographicRange(this.start, this.end);
  }

  contains(n: number): boolean {
    return n >= this.start && n < this.end;
  }

  toString(): string {
    if (this.end > 999999) return ` > ${this.start}`;

    if (this.start === this.end) return `${this.start}`;

    return `${this.start} - ${this.end}`;
  }
}
