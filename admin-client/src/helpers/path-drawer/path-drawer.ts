import { pointer, select, Selection } from 'd3-selection';
import {
  PathGroupSelector,
  HoveredColor,
  HoveredOpacity,
  SelectedColor,
  SelectedOpacity,
  UnselectedColor,
  UnselectedOpacity,
} from './path-constants';
import Path from './path';
import PathNode from './path-node';
import PathSvg from './path-svg';

export type OnUpdateCallback = (paths: any) => void;

export type OnSelectCallback = (index: number) => void;

export default class PathDrawer {
  paths: Path[] = [];

  svgPaths: PathSvg[] = [];

  selectedPathIndex: number | null = null;

  highlightedPathIndex: number | null = null;

  svg: Selection<SVGElement, unknown, null, undefined>;

  mainContainer: Selection<SVGGElement, unknown, null, undefined>;

  onUpdate: OnUpdateCallback;

  onSelect: OnSelectCallback;

  constructor(svgElement: SVGElement, onUpdate: OnUpdateCallback, onSelect: OnSelectCallback) {
    this.svg = select(svgElement);
    this.mainContainer = this.svg.append('g');
    this.onUpdate = onUpdate;
    this.onSelect = onSelect;

    this.setAddNewNodeListener();
  }

  setPaths(coordinates: number[][][]): void {
    this.paths = [];
    this.paths = coordinates.map((p) => {
      const nodes = p.map(([x, y]) => new PathNode(x, y));
      return new Path(nodes);
    });
    this.redraw();
  }

  refresh(): void {
    this.redraw();
  }

  private setAddNewNodeListener(): void {
    this.svg.on('dblclick', (event: MouseEvent) => {
      this.addNewNode(event);
    });
  }

  private addNewNode(event: MouseEvent): void {
    if (this.selectedPathIndex === null) return;

    const selectedPath = this.paths[this.selectedPathIndex];
    const selectedSvg = this.svgPaths[this.selectedPathIndex];

    if (selectedPath != null) {
      const coords = pointer(event);
      selectedPath.addNode(new PathNode(coords[0], coords[1]));
      selectedSvg.redraw();
      this.notifyPathUpdates();
    }
  }

  private redraw(): void {
    this.svgPaths = [];
    this.mainContainer.selectAll(`g.${PathGroupSelector}`).remove();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    this.mainContainer
      .selectAll(`g.${PathGroupSelector}`)
      .data(this.paths)
      .enter()
      .append('g')
      .attr('class', PathGroupSelector)
      .each(function redrawEachPath(path, pathIdx) {
        self.redrawPath(this, path, pathIdx);
      });

    this.refreshPaths();
    this.notifyPathUpdates();
  }

  private redrawPath(el: SVGGElement, path: Path, pathIdx: number): void {
    const container = select(el);

    const svgPath = new PathSvg(
      container,
      path,
      (x, y) => this.validateBorders(x, y),
      () => {
        this.notifyPathUpdates();
      },
      () => {
        this.highlightPath(pathIdx);
      },
      () => {
        this.highlightPath();
      },
      () => {
        this.selectPath(pathIdx);
        this.onSelect(pathIdx);
      }
    );

    this.svgPaths.push(svgPath);
  }

  private validateBorders(x: number, y: number): boolean {
    return (
      x > 0 &&
      x < parseFloat(this.svg.attr('width')) &&
      y > 0 &&
      y < parseFloat(this.svg.attr('height'))
    );
  }

  private notifyPathUpdates(): void {
    this.onUpdate(
      this.paths.map((path) => path.getNodes().map((node) => [node.getX(), node.getY()]))
    );
  }

  private refreshPaths(): void {
    const selectedPathSvg =
      this.selectedPathIndex !== null ? this.svgPaths[this.selectedPathIndex] : null;
    const highlightedSvg =
      this.highlightedPathIndex !== null ? this.svgPaths[this.highlightedPathIndex] : null;

    this.svgPaths.forEach((svgPath) => {
      svgPath.setStyle({ color: UnselectedColor, opacity: UnselectedOpacity });
      svgPath.disable();
    });

    if (highlightedSvg != null)
      highlightedSvg.setStyle({ color: HoveredColor, opacity: HoveredOpacity });

    if (selectedPathSvg != null) {
      selectedPathSvg.setStyle({ color: SelectedColor, opacity: SelectedOpacity });
      selectedPathSvg.disable(false);
    }
  }

  private selectPath(index: number): void {
    this.selectedPathIndex = index;
    this.refreshPaths();
  }

  private highlightPath(index?: number): void {
    this.highlightedPathIndex = index ?? null;
    this.refreshPaths();
  }
}
