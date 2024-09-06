/**
 * Liquid volume estimation using linear interpolation between two nearest volume samples.
 *
 * @param fillLevel - normalised linear fill level from the sliding scale slider. Must be between
 * f0 and f1.
 * @param f0 - normalised linear fill level for the nearest measurement less than fillLevel.
 * @param v0 - measured volume in ml corresponding to the fill level f0.
 * @param f1 - normalised linear fill level for the nearest measurement greater or equal to fillLevel.
 * @param v1 - measured volume in ml corresponding to the fill level f1.
 *
 * Calculates the interpolation parameter by dividing the distance between the reported fill level
 * and the smaller measurement's fill level (f0) by the distance between the two nearest samples'
 * fill levels (f1 - f0).
 *
 * The interpolation parameter is then applied to the corresponding volume measurements.
 *
 * @returns liquid volume in ml corresponding to the normalised linear fillLevel.
 */
export function interpolate(fillLevel: number, f0: number, v0: number, f1: number, v1: number): number {
  const a = (fillLevel - f0) / (f1 - f0);
  return v0 + (v1 - v0) * a;
}

/**
 * Liquid volume estimation using the sliding scale.
 *
 * @param volumes - array of physical volume measurements. Must have even length. Every pair of
 * elements represent a normalised linear fill level (0 to 1 inclusive) and the corresponding volume
 * measurement in ml.
 * @param fillLevel - normalised linear fill level from the sliding scale slider. Must be between
 * 0 and 1 inclusive.
 *
 * Converts the normalised fill level from the sliding scale into a volume value in ml. Finds
 * two nearest physical measurements in the volumes array and performs linear interpolation
 * between them.
 *
 * @returns liquid volume in ml corresponding to the normalised linear fillLevel.
 */
export function calculateVolume(volumes: number[], fillLevel: number) {
  if (fillLevel < 0)
    return 0;

  if (volumes.length % 2 !== 0) {
    console.warn(
      `Expected volume samples array to have even length but its length is ${volumes.length}. Check the drink scale data.`,
    );
  }

  const samplesCount = Math.floor(volumes.length / 2);

  let i: number;

  for (i = 0; i < samplesCount; i++) {
    if (volumes[i * 2] >= fillLevel)
      break;
  }

  if (i === 0)
    return interpolate(fillLevel, 0, 0, volumes[0], volumes[1]);

  if (i === samplesCount)
    return volumes[i * 2 - 1];

  return interpolate(
    fillLevel,
    volumes[(i - 1) * 2],
    volumes[(i - 1) * 2 + 1],
    volumes[i * 2],
    volumes[i * 2 + 1],
  );
}

/**
 * Calculates the bounding box of the drink scale's fillable volume shape.
 *
 * @param outlineCoordinates - array of line segment coordinates in the normalised coordinate space.
 * Must have even length. Every pair of elements represents a 2D point defined by (x, y) coordinates
 * in the range [0, 1].
 *
 * @returns  { minX, maxX, minY, maxY }
 */
export function getScaleBounds(outlineCoordinates: number[]) {
  const coordinatesCount = Math.floor(outlineCoordinates.length);

  let minY = Number.MAX_VALUE;
  let maxY = Number.MIN_VALUE;
  let minX = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;

  for (let i = 0; i < coordinatesCount; ++i) {
    const x = outlineCoordinates[i * 2];
    const y = outlineCoordinates[i * 2 + 1];
    if (x < minX)
      minX = x;
    if (x > maxX)
      maxX = x;
    if (y < minY)
      minY = y;
    if (y > maxY)
      maxY = y;
  }

  return { minX, maxX, minY, maxY };
}

export function toSvgPolygonPoints(outlineCoordinates: number[], widthPx: number, heightPx: number, horizontalOffsetPx: number, verticalOffsetPx: number): string {
  const pointCount = Math.floor(outlineCoordinates.length / 2);

  // String concatenation seems to be OK performance-wise
  // https://josephmate.github.io/java/javascript/stringbuilder/2020/07/27/javascript-does-not-need-stringbuilder.html
  let pointsStr = '';
  for (let i = 0; i < pointCount; ++i) {
    if (i !== 0)
      pointsStr += ' ';
    pointsStr += `${outlineCoordinates[i * 2] * widthPx + horizontalOffsetPx},${outlineCoordinates[i * 2 + 1] * heightPx + verticalOffsetPx}`;
  }
  return pointsStr;
}
