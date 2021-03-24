import Entity from './Entity';

/* eslint-disable @typescript-eslint/lines-between-class-members */
export default class EntityManager {
  #idAmount: number = 0;
  #entitiesMap: object = {};
  #entities: Entity[] = [];

  private GenerateName() {
    this.#idAmount += 1;
    return `__entity__${this.#idAmount}`;
  }

  public get(name: string) {
    return this.#entitiesMap[name];
  }

  public filter(cb) {
    return this.#entities.filter(cb);
  }

  public add(entity: Entity, name_: string) {
    let name;
    if (!name_) {
      name = this.GenerateName();
    } else name = name_;

    this.#entitiesMap[name] = entity;
    this.#entities.push(entity);

    entity.setParent(this);
    entity.setName(name);
  }

  public setActive(entity, bool) {
    const i = this.#entities.indexOf(entity);
    if (!bool) {
      if (i < 0) return;

      this.#entities.slice(i, 1);
    } else {
      if (i >= 0) return;

      this.#entities.push(entity);
    }
  }

  public update(timeElapsed) {
    this.#entities.forEach((entity) => {
      entity.update(timeElapsed);
    });
  }
}
