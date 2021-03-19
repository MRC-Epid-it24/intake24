import PathNode from './path-node';

export default class Path {
  private nodes: PathNode[];

  constructor(nodes: PathNode[]) {
    this.nodes = nodes;
  }

  static distance(n1: PathNode, n2: PathNode): number {
    const x = (n1.getX() - n2.getX()) ** 2;
    const y = (n1.getY() - n2.getY()) ** 2;
    return Math.sqrt(x + y);
  }

  static dot(n1: PathNode, n2: PathNode): number {
    return n1.getX() * n2.getX() + n1.getY() * n2.getY();
  }

  static closestPoint(start: PathNode, end: PathNode, pt: PathNode): PathNode {
    const lv = new PathNode(start.getX() - end.getX(), start.getY() - end.getY());
    const ptv = new PathNode(pt.getX() - end.getX(), pt.getY() - end.getY());

    const len = Math.sqrt(Path.dot(lv, lv));
    const uv = new PathNode(lv.getX() / len, lv.getY() / len);

    const projlen = Path.dot(ptv, uv);

    if (projlen < 0) return end;
    if (projlen > len) return start;
    return new PathNode(uv.getX() * projlen + end.getX(), uv.getY() * projlen + end.getY());
  }

  addNode(pathNode: PathNode): void {
    let shortestDistance = null;
    let index = 0;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.nodes.length; i++) {
      let cp;
      if (this.nodes[i + 1] == null) {
        cp = Path.closestPoint(this.nodes[i], this.nodes[0], pathNode);
      } else {
        cp = Path.closestPoint(this.nodes[i], this.nodes[i + 1], pathNode);
      }
      const d = Path.distance(cp, pathNode);
      if (shortestDistance == null || d < shortestDistance) {
        shortestDistance = d;
        index = i + 1;
      }
    }

    this.nodes.splice(index, 0, pathNode);
  }

  removeNode(node: PathNode): void {
    const i = this.nodes.indexOf(node);
    this.nodes.splice(i, 1);
  }

  getNodes(): PathNode[] {
    return this.nodes;
  }
}
