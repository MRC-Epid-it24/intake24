export function getContrastYIQ(color: string) {
  const r = Number.parseInt(color.substring(1, 3), 16);
  const g = Number.parseInt(color.substring(3, 5), 16);
  const b = Number.parseInt(color.substring(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}
