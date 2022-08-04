import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('');
// @ts-expect-error type issue
const DOMPurify = createDOMPurify(dom.window);

export type SanitizeInputOptions = {
  emptyStringToNull?: boolean;
};

const createSanitizer = ({ emptyStringToNull }: SanitizeInputOptions = {}) => {
  const sanitize = (input: any) => {
    let output = input;

    if (typeof input === 'string') {
      output = DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });
      output = output.trim();
      if (emptyStringToNull && !output.length) output = null;
    }

    if (Array.isArray(input)) output = input.map((item) => sanitize(item));

    if (Object.prototype.toString.call(input) === '[object Object]') {
      output = Object.entries(input).reduce<any>((acc, [key, value]) => {
        acc[key] = sanitize(value);
        return acc;
      }, {});
    }

    return output;
  };

  return sanitize;
};

export default createSanitizer;
