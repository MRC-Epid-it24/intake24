export const colors = {
  background: '#F5F5F5',
  primary: '#EE672D',
  secondary: '#020202',
  ternary: '#FEE8E1',
  quaternary: '#D34980',
  accent: '#F68623',
  info: '#4456A6',
  'info-2': '#77C044',
  'info-3': '#B968DC',
  'info-4': '#41C3EC',
  'info-5': '#FFDB59',
};

export const variants = ['flat', 'text', 'elevated', 'tonal', 'outlined', 'plain'] as const;
export type Variant = typeof variants[number];
