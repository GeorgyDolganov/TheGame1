/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Quaternion, Vector3 } from '@babylonjs/core';

export default class Entity {
  public #name: string = '';
  public components: object = {};
  public position: Vector3 = new Vector3();
  public rotation: Quaternion = new Quaternion();
  public handlers: object = {};
  public parent = null;

  /**
   * Registers new handler
   * @param n Name
   * @param h Handler
   */
  public registerHandler(n, h) {
    if (!(n in this.handlers)) {
      this.handlers[n] = [];
    }
    this.handlers[n].push(h);
  }

  /**
   * Sets new parent for this entity
   * @param p Parent
   */
  public setParent(p) {
    this.parent = p;
  }

  /**
   * Sets new name for this entity
   * @param n Name
   */
  public setName(n) {
    this.#name = n;
  }

  public get name() {
    return this.#name;
  }

  public setActive(bool) {
    this.parent.setActive(this, bool);
  }

  public addComponent(component) {
    component.setParent(this);
    this.components[component.name] = component;

    component.initComponent();
  }

  public getComponent(name) {
    return this.components[name];
  }

  public findEntity(name) {
    return this.parent.get(name);
  }

  public broadcast(msg) {
    if (!(msg.topic in this.handlers)) return;

    this.handlers[msg.topic].forEach((curHandler) => {
      curHandler(msg);
    });
  }

  public setPosition(p) {
    this.position.copyFrom(p);
    this.broadcast({
      topic: 'update.position',
      value: this.position,
    });
  }

  public update(timeElapsed) {
    Object.keys(this.components).forEach((key) => {
      this.components[key].update(timeElapsed);
    });
  }
}
