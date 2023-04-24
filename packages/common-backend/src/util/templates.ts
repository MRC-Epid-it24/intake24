import type { DOMWindow } from 'jsdom';
import { JSDOM } from 'jsdom';

export const replaceCssAsInlineStyle = (html: string) => {
  const docType = html.split('\n')[0];
  const window = new JSDOM(html).window;

  replaceCssAsInlineStyleElement(window.document.body, window);

  return docType.startsWith('<!DOCTYPE')
    ? `${docType}\n${window.document.documentElement.outerHTML}`
    : window.document.documentElement.outerHTML;
};

export const replaceCssAsInlineStyleElement = (element: HTMLElement, window: DOMWindow) => {
  if (!element) return;

  const computedStyle = window.getComputedStyle(element);

  for (let i = 0; i < computedStyle.length; i++) {
    const property = computedStyle[i];
    //@ts-expect-error - should be filtered key of CSSStyleDeclaration
    element.style[property] = computedStyle.getPropertyValue(property);
  }

  [...element.children].forEach((child) => {
    replaceCssAsInlineStyleElement(child as HTMLElement, window);
  });
};
