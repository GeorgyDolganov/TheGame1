import { math } from '../utils/math';

function key(x, y) {
  return `${x}.${y}`;
}

export default class SpatialHashGrid {
  #bounds;

  #dimensions;

  #cells;

  constructor(bounds, dimensions) {
    this.#bounds = bounds;
    this.#dimensions = dimensions;
    this.#cells = new Map();
  }

  /**
   * Creates and returns a new client
   * @param position client's pos
   * @param dimensions client's dim
   * @returns {position: [number, number], dimentions: [number, number], indices}
   */
  newClient(position, dimensions) {
    const client = {
      position,
      dimensions,
      indices: null,
      _cells: {
        min: null,
        max: null,
        nodes: null,
      },
      _queryId: -1,
    };

    this.Insert(client);
    return client;
  }

  private Insert(client: { position, dimensions, indices }) {
    const [x, y] = client.position;
    const [w, h] = client.dimensions;

    const i1 = this.GetCellIndex([x - w / 2, y - h / 2]);
    const i2 = this.GetCellIndex([x + w / 2, y + h / 2]);

    // eslint-disable-next-line no-param-reassign
    client.indices = [i1, i2];

    for (let xb = i1[0], xn = i2[0]; xb <= xn; xb += 1) {
      for (let yb = i1[1], yn = i2[1]; yb <= yn; yb += 1) {
        const k = key(xb, yb);

        if (!(k in this.#cells)) {
          this.#cells[k] = new Set();
        }

        this.#cells[k].add(client);
      }
    }
  }

  private GetCellIndex(position) {
    const x = math.sat(position[0] - this.#bounds[0])
      / (this.#bounds[1][0] - this.#bounds[0][0]);
    const y = math.sat(position[1] - this.#bounds[1])
      / (this.#bounds[1][1] - this.#bounds[0][1]);
    const xIndex = Math.floor(x * (this.#dimensions[0] - 1));
    const yIndex = Math.floor(y * (this.#dimensions[1] - 1));

    return [xIndex, yIndex];
  }

  findNear(position, bounds) {
    const [x, y] = position;
    const [w, h] = bounds;

    const i1 = this.GetCellIndex([x - w / 2, y - h / 2]);
    const i2 = this.GetCellIndex([x + w / 2, y + h / 2]);

    const clients = new Set();

    for (let xb = i1[0], xn = i2[0]; xb <= xn; xb += 1) {
      for (let yb = i1[1], yn = i2[1]; yb <= yn; yb += 1) {
        const k = key(xb, yb);

        if (k in this.#cells) {
          this.#cells[k].forEach((el) => {
            clients.add(el);
          });
        }
      }
    }
    return clients;
  }

  updateClient(client) {
    this.removeClient(client);
    this.Insert(client);
  }

  removeClient(client) {
    const [i1, i2] = client.indices;

    for (let xb = i1[0], xn = i2[0]; xb <= xn; xb += 1) {
      for (let yb = i1[1], yn = i2[1]; yb <= yn; yb += 1) {
        const k = key(xb, yb);

        this.#cells[k].delete(client);
      }
    }
  }
}
