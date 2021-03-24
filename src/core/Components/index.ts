import Entity from '../Entity';

export default class Component {
  public parent: Entity;

  public setParent(parent) {
    this.parent = parent;
  }

  public getComponent(name) {
    return this.parent.getComponent(name);
  }

  public findEntity(name) {
    return this.parent.findEntity(name);
  }

  public broadcast(msg) {
    this.parent.broadcast(msg);
  }

  public registerHandler(name, handler) {
    this.parent.registerHandler(name, handler);
  }
}
