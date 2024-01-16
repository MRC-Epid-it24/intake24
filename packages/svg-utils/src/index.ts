import { readFile } from 'node:fs/promises';

import type { ElementNode, Node, RootNode } from 'svg-parser';
import { parse } from 'svg-parser';
import * as svgpath from 'svgpath';

import type { SvgPath } from './types';

const supportedSegmentTypes = ['M', 'L', 'H', 'V', 'm', 'l', 'h', 'v', 'z', 'Z'];

function getTransform(node: ElementNode): string | undefined {
  return node.properties?.['transform']?.toString();
}

function convertToNormalisedCoordinates(viewBox: number[], path: SvgPath): number[] {
  const [minX, minY, width, height] = viewBox;

  const coords: number[] = [];

  path.iterate((segment, index, x, y) => {
    if (!supportedSegmentTypes.includes(segment[0]))
      throw new Error(`SVG path segment type ${segment[0]} is not supported`);

    // Coordinate at index 0 is initial 0, 0
    if (index > 0) coords.push((x - minX) / width, (y - minY) / height);
  });

  return coords;
}

function findOutlinePath(current: Node, transformStack: string[]): [string, string[]] | undefined {
  if (current.type === 'element') {
    if (current.tagName === 'path' && current.properties?.['id'] === 'outline') {
      const pathData = current.properties['d'];

      if (pathData === undefined || typeof pathData !== 'string') {
        throw new Error(
          'Found a path node with the id "outline" but it has no path data attribute'
        );
      }

      const tx = getTransform(current);

      return tx != undefined ? [pathData, transformStack.concat(tx)] : [pathData, transformStack];
    }

    const tx = getTransform(current);

    for (const child of current.children) {
      if (typeof child === 'string') continue;

      const outlinePath = findOutlinePath(
        child,
        tx != undefined ? transformStack.concat(tx) : transformStack
      );

      if (outlinePath != undefined) return outlinePath;
    }
  } else return undefined;
}

function getViewBox(root: RootNode): number[] {
  for (const node of root.children) {
    if (node.type === 'element' && node.tagName === 'svg') {
      const viewBox = node.properties?.['viewBox'];

      if (viewBox != undefined && typeof viewBox === 'string') {
        return viewBox.split(' ').map((s) => parseFloat(s));
      }
    }
  }

  throw new Error('Failed to find the <svg> element or it has no viewBox attribute');
}

export async function getDrinkScale(svgPath: string): Promise<number[]> {
  const svg = await readFile(svgPath, 'utf-8');
  const root = parse(svg);

  const outline = findOutlinePath(root.children[0], []);

  if (outline != undefined) {
    const [pathData, transformStack] = outline;

    let path = svgpath.from(pathData);

    for (const tx of transformStack) {
      path = path.transform(tx);
    }

    return convertToNormalisedCoordinates(getViewBox(root), path);
  } else {
    throw new Error('Failed to find the outline node in the SVG file');
  }
}
