/*
 O(n^2), probably a better solution exists but input size is very small
 */
export function countOrderViolations(indices: number[]): number {
  function violationsForPos(pos: number): number {
    let violations = 0;
    for (let i = 0; i < indices.length; ++i) {
      if (i === pos)
        continue;
      if (i < pos && indices[i] > indices[pos])
        violations++;
      if (i > pos && indices[i] < indices[pos])
        violations++;
    }
    return violations;
  }

  let violations = 0;

  for (let i = 0; i < indices.length; ++i) violations += violationsForPos(i);

  return violations;
}

export function countDistanceViolations(indices: number[]): number {
  let violations = 0;

  for (let i = 1; i < indices.length; ++i)
    violations += Math.abs(indices[i] - indices[i - 1]) - 1;

  return violations;
}
