const trimStrings = (input: any) => {
  let output = input;

  if (typeof input === 'string') {
    const chars = input.trim();
    output = chars.length ? chars : null;
  }

  if (Array.isArray(input)) output = input.map((item) => trimStrings(item));

  if (Object.prototype.toString.call(input) === '[object Object]') {
    output = Object.entries(input).reduce<any>((acc, [key, value]) => {
      acc[key] = trimStrings(value);
      return acc;
    }, {});
  }

  return output;
};

export default trimStrings;
