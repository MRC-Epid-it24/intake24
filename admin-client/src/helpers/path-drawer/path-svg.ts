import { select, Selection } from 'd3-selection';
import 'd3-transition';
import { drag } from 'd3-drag';
import Path from './path';
import {
  ActiveNodeRadius,
  InvisibleNodeRadius,
  InvisibleNodeSelector,
  LineSelector,
  LineGroupSelector,
  NodeSelector,
  NodeGroupSelector,
  NodeRadius,
  strokeWidth,
  transitionDuration,
  UnselectedColor,
  UnselectedOpacity,
} from './path-constants';
import PathNode from './path-node';

export type PathNodeSelection = Selection<SVGCircleElement, PathNode, SVGGElement, unknown>;

export type PathNodeLineSelection = Selection<SVGLineElement, PathNode[], SVGGElement, unknown>;

export type Style = {
  color: string | number | boolean;
  opacity: string | number | boolean;
};

export default class PathSvg {
  container: Selection<SVGGElement, unknown, null, undefined>;

  path: Path;

  disabled = false;

  style: Style = { color: UnselectedColor, opacity: UnselectedOpacity };

  lines!: PathNodeLineSelection;

  nodes!: PathNodeSelection;

  invisibleNodes!: PathNodeSelection;

  validateBorders;

  onUpdate;

  onMouseOver;

  onMouseLeave;

  onClick;

  constructor(
    svgSelection: Selection<SVGGElement, unknown, null, undefined>,
    path: Path,
    validateBorders: (x: number, y: number) => boolean,
    onUpdate: () => void,
    onMouseOver: () => void,
    onMouseLeave: () => void,
    onClick: () => void
  ) {
    this.container = svgSelection;
    this.path = path;

    this.validateBorders = validateBorders;
    this.onUpdate = onUpdate;
    this.onMouseOver = onMouseOver;
    this.onMouseLeave = onMouseLeave;
    this.onClick = onClick;

    this.refresh();
  }

  setStyle(style: Style): void {
    this.style = { ...style };
    this.applyStyle();
  }

  redraw(): void {
    this.refresh();
  }

  disable(bool?: boolean | null): void {
    this.disabled = !!bool;
  }

  private refresh(): void {
    this.drawLines();
    this.drawNodes();
    this.refreshPositions();
    PathSvg.setNodesCoords(this.invisibleNodes);
    this.applyStyle();
    this.setPathAreaMouseEventListeners();
  }

  private drawNodes(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    this.container.selectAll(`g.${NodeGroupSelector}`).remove();

    const group = this.container
      .append('g')
      .attr('class', NodeGroupSelector)
      .selectAll(`circle.${NodeSelector}`)
      .data((d) => (d as Path).getNodes())
      .enter();

    this.nodes = group.append('circle').attr('class', NodeSelector).attr('r', NodeRadius);

    this.invisibleNodes = group
      .append('circle')
      .attr('class', InvisibleNodeSelector)
      .style('fill', 'transparent')
      .attr('r', InvisibleNodeRadius)
      .on('dblclick', (event, node) => this.removeNode(event, node))
      .on('mouseover', (event, node) => this.hoverNode(event, node))
      .on('mouseout', (event, node) => this.hoverNode(event, node))
      .call(
        drag<SVGCircleElement, PathNode>()
          .on('drag', function onDrag(event, node) {
            self.dragged(this, event, node);
          })
          .on('end', () => {
            self.dragEnded();
          })
      );
  }

  private removeNode(event: MouseEvent, node: PathNode) {
    event.stopPropagation();

    this.path.removeNode(node);
    this.refresh();
  }

  private drawLines() {
    this.container.selectAll(`g.${LineGroupSelector}`).remove();

    const group = this.container.append('g').attr('class', LineGroupSelector);

    this.lines = group
      .selectAll(`g.${LineSelector}`)
      .data((d) => {
        const nodes = (d as Path).getNodes();
        const lines = [];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i + 1] != null) {
            lines.push([nodes[i], nodes[i + 1]]);
          } else {
            lines.push([nodes[i], nodes[0]]);
          }
        }
        return lines;
      })
      .enter()
      .append('line')
      .attr('class', LineSelector)
      .attr('stroke-width', strokeWidth);
  }

  private refreshPositions() {
    PathSvg.setLinesCoords(this.lines);
    PathSvg.setNodesCoords(this.nodes);
  }

  private static setNodesCoords(nodes: PathNodeSelection) {
    nodes.attr('cx', (node) => node.getX()).attr('cy', (node) => node.getY());
  }

  private static setLinesCoords(lines: PathNodeLineSelection) {
    lines
      .attr('x1', (node) => node[0].getX())
      .attr('y1', (node) => node[0].getY())
      .attr('x2', (node) => node[1].getX())
      .attr('y2', (node) => node[1].getY());
  }

  private applyStyle() {
    this.styleNodes(this.nodes);
    this.styleLines(this.lines);
  }

  private styleNodes(nodes: PathNodeSelection) {
    nodes
      .transition()
      .duration(transitionDuration)
      .style('fill', this.style.color)
      .style('opacity', this.style.opacity);
  }

  private styleLines(lines: PathNodeLineSelection) {
    lines
      .transition()
      .duration(transitionDuration)
      .style('stroke', this.style.color)
      .style('stroke-opacity', this.style.opacity);
  }

  private hoverNode(event: MouseEvent, node: PathNode) {
    event.preventDefault();

    const mouseOver = event.type === 'mouseover';
    const r = mouseOver ? ActiveNodeRadius : NodeRadius;

    this.nodes.transition().duration(transitionDuration).attr('r', r);
    /* .attr('r', function (d, i) {
        return ActiveNodeRadius;
        // return index === i ? r : NodeRadius;
      }); */

    setTimeout(() => {
      // Fixme: timeout is to first apply hover effect and then style the path according to _styleNodes.
      if (mouseOver) {
        this.onMouseOver();
      } else {
        this.onMouseLeave();
      }
    }, 50);
  }

  private dragged(el: Element, event: any, node: PathNode) {
    const { x, y } = event;
    if (!this.disabled && this.validateBorders(x, y)) {
      select(el).attr('cx', x).attr('cy', y);
      node.set(x, y);
      this.refreshPositions();
    }
  }

  private dragEnded() {
    if (!this.disabled) {
      this.onUpdate();
    }
  }

  private setPathAreaMouseEventListeners() {
    this.container
      .on('mouseover', this.onMouseOver)
      .on('mouseout', this.onMouseLeave)
      .on('click', this.onClick);
  }
}
