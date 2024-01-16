export type MoveToAbs = ['M', number, number];
export type LineToAbs = ['L', number, number];
export type HorizontalLineToAbs = ['H', number];
export type VerticalLineToAbs = ['V', number];
export type CurveToAbs = ['C', number, number, number, number, number, number];
export type SmoothCurveToAbs = ['S', number, number, number, number];
export type QuadraticBézierCurveToAbs = ['Q', number, number, number, number];
export type SmoothQuadraticBézierCurveToAbs = ['T', number, number];
export type EllipticalArcAbs = ['A', number, number, number, number, number, number, number];

export type MoveToRel = ['m', number, number];
export type LineToRel = ['l', number, number];
export type HorizontalLineToRel = ['h', number];
export type VerticalLineToRel = ['v', number];
export type CurveToRel = ['c', number, number, number, number, number, number];
export type SmoothCurveToRel = ['s', number, number, number, number];
export type QuadraticBézierCurveToRel = ['q', number, number, number, number];
export type SmoothQuadraticBézierCurveToRel = ['t', number, number];
export type EllipticalArcRel = ['a', number, number, number, number, number, number, number];

export type ClosePath = ['Z' | 'z'];

export type Segment =
  | MoveToAbs
  | MoveToRel
  | LineToAbs
  | LineToRel
  | HorizontalLineToAbs
  | HorizontalLineToRel
  | VerticalLineToAbs
  | VerticalLineToRel
  | CurveToAbs
  | CurveToRel
  | SmoothCurveToAbs
  | SmoothCurveToRel
  | QuadraticBézierCurveToAbs
  | QuadraticBézierCurveToRel
  | SmoothQuadraticBézierCurveToAbs
  | SmoothQuadraticBézierCurveToRel
  | EllipticalArcAbs
  | EllipticalArcRel
  | ClosePath;

export interface SvgPath {
  (path: string): SvgPath;
  from(path: string | SvgPath): SvgPath;
  abs(): SvgPath;
  rel(): SvgPath;
  scale(sx: number, sy?: number): SvgPath;
  translate(x: number, y?: number): SvgPath;
  rotate(angle: number, rx?: number, ry?: number): SvgPath;
  skewX(degrees: number): SvgPath;
  skewY(degrees: number): SvgPath;
  matrix(m: number[]): SvgPath;
  transform(str: string): SvgPath;
  unshort(): SvgPath;
  unarc(): SvgPath;
  toString(): string;
  round(precision: number): SvgPath;
  iterate(
    iterator: (segment: Segment, index: number, x: number, y: number) => void,
    keepLazyStack?: boolean
  ): SvgPath;
}
