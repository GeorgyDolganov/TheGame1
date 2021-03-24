/* eslint-disable @typescript-eslint/lines-between-class-members */
import Component from '.';
import SpatialHashGrid from '../SpatialHashGrid';

interface ClientInterface {
  position: [number, number];
  dimensions: [number, number];
  indices: [number, number];
  _cells: {
    min: null;
    max: null;
    nodes: null;
  };
  _queryId: number;
}

export default class SpatialHashController extends Component {
  #grid: SpatialHashGrid;
  public client: ClientInterface;

  constructor(params) {
    super();

    this.#grid = params.grid;
  }

  public initComponent() {
    const pos = [this.parent.position.x, this.parent.position.y];

    this.client = this.#grid.newClient(pos, [1, 1]);
    this.registerHandler('update.position', (m) => this.onPosition(m));
  }

  private onPosition(msg) {
    this.client.position = [msg.value.x, msg.value.z];
    this.#grid.updateClient(this.client);
  }

  public findNearbyEntities(range) {
    const results = this.#grid.findNear(
      [this.parent.position.x, this.parent.position.y], [range, range],
    );
    return Array.from(results).filter((c: any) => c.entity !== this.parent);
  }
}
