import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('');
// @ts-expect-error type issue
const DOMPurify = createDOMPurify(dom.window);

const sanitizeInput = (input: any) => {
  let output = input;

  if (typeof input === 'string')
    output = DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });

  if (Array.isArray(input)) output = input.map((item) => sanitizeInput(item));

  if (Object.prototype.toString.call(input) === '[object Object]') {
    output = Object.entries(input).reduce<any>((acc, [key, value]) => {
      acc[key] = sanitizeInput(value);
      return acc;
    }, {});
  }

  return output;
};

export default sanitizeInput;
